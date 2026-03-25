import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  // Mixins - Instance
  include MixinStorage();

  // Types
  type UserRole = AccessControl.UserRole;

  type CategoryId = Text;
  type ProductId = Text;
  type ReviewId = Nat;
  type OrderId = Nat;

  type Size = Nat;

  type Price = Nat;

  type SizeVariant = {
    size : Size;
    price : Price;
  };

  type Gender = {
    #male;
    #female;
    #unisex;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  type Category = {
    id : CategoryId;
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
  };

  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    category : CategoryId;
    sizes : [SizeVariant];
    image : ?Storage.ExternalBlob;
    gender : Gender;
    tags : [Text];
    featured : Bool;
    inStock : Bool;
    inspiredBy : Text;
    createdAt : Time.Time;
  };

  type OrderItem = {
    productId : Text;
    size : Size;
    quantity : Nat;
    price : Price;
  };

  type OrderRecord = {
    id : OrderId;
    customerName : Text;
    phone : Text;
    address : Text;
    city : Text;
    items : [OrderItem];
    total : Price;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  type Review = {
    id : ReviewId;
    productId : ProductId;
    customerName : Text;
    rating : Nat;
    comment : Text;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  // Helper modules
  module Category {
    public func compare(c1 : Category, c2 : Category) : Order.Order {
      Text.compare(c1.name, c2.name);
    };
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  module Review {
    public func compare(r1 : Review, r2 : Review) : Order.Order {
      Nat.compare(r1.rating, r2.rating);
    };
  };

  module OrderItem {
    public func compare(o1 : OrderItem, o2 : OrderItem) : Order.Order {
      let result = Text.compare(o1.productId, o2.productId);
      if (result != #equal) {
        return result;
      };

      Nat.compare(o1.size, o2.size);
    };
  };

  module OrderRecord {
    public func compareByCreatedAt(o1 : OrderRecord, o2 : OrderRecord) : Order.Order {
      Int.compare(o2.createdAt, o1.createdAt);
    };

    public func compare(o1 : OrderRecord, o2 : OrderRecord) : Order.Order {
      Int.compare(o1.createdAt, o2.createdAt);
    };
  };

  // State
  // Access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent state
  var nextOrderId = 1;
  var nextReviewId = 1;

  let categories = Map.empty<CategoryId, Category>();
  let products = Map.empty<ProductId, Product>();
  let reviews = Map.empty<ProductId, Map.Map<ReviewId, Review>>();
  let orders = Map.empty<OrderId, OrderRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Category CRUD
  public shared ({ caller }) func createCategory(name : Text, description : Text, image : ?Storage.ExternalBlob) : async CategoryId {
    requireAdmin(caller);

    let id = name.toLower().replace(#char ' ', "-");
    if (categories.containsKey(id)) {
      Runtime.trap("Category already exists");
    };

    if (id == "") {
      Runtime.trap("Category ID cannot be empty. ");
    };

    let category : Category = {
      id;
      name;
      description;
      image;
    };

    categories.add(id, category);
    id;
  };

  public query ({ caller }) func getCategories() : async [Category] {
    categories.values().toArray().sort();
  };

  public query ({ caller }) func getCategory(id : CategoryId) : async Category {
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category does not exist") };
      case (?category) { category };
    };
  };

  public shared ({ caller }) func updateCategory(id : CategoryId, name : Text, description : Text, image : ?Storage.ExternalBlob) : async () {
    requireAdmin(caller);

    if (not categories.containsKey(id)) { Runtime.trap("Category does not exist") };

    let category : Category = {
      id;
      name;
      description;
      image;
    };

    categories.add(id, category);
  };

  public shared ({ caller }) func deleteCategory(id : CategoryId) : async () {
    requireAdmin(caller);
    if (not categories.containsKey(id)) { Runtime.trap("Category does not exist") };
    categories.remove(id);
  };

  // Product CRUD
  public shared ({ caller }) func createProduct(name : Text, description : Text, category : CategoryId, sizes : [SizeVariant], image : ?Storage.ExternalBlob, gender : Gender, tags : [Text], featured : Bool, inStock : Bool, inspiredBy : Text) : async ProductId {
    requireAdmin(caller);

    let id = name.toLower().replace(#char ' ', "-");
    if (products.containsKey(id)) { Runtime.trap("Product already exists") };

    if (id == "") {
      Runtime.trap("Product ID cannot be empty. ");
    };

    let product : Product = {
      id;
      name;
      description;
      category;
      sizes;
      image;
      gender;
      tags;
      featured;
      inStock;
      inspiredBy;
      createdAt = Time.now();
    };

    products.add(id, product);
    id;
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func updateProduct(id : ProductId, name : Text, description : Text, category : CategoryId, sizes : [SizeVariant], image : ?Storage.ExternalBlob, gender : Gender, tags : [Text], featured : Bool, inStock : Bool, inspiredBy : Text) : async () {
    requireAdmin(caller);

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?existing) {
        let product : Product = {
          id;
          name;
          description;
          category;
          sizes;
          image;
          gender;
          tags;
          featured;
          inStock;
          inspiredBy;
          createdAt = existing.createdAt;
        };

        products.add(id, product);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    requireAdmin(caller);
    products.remove(id);
  };

  // Reviews
  public shared ({ caller }) func addReview(productId : ProductId, customerName : Text, rating : Nat, comment : Text) : async ReviewId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    let reviewId = nextReviewId;
    nextReviewId += 1;

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let review : Review = {
      id = reviewId;
      productId;
      customerName;
      rating;
      comment;
      createdAt = Time.now();
    };

    let productReviews = switch (reviews.get(productId)) {
      case (null) { Map.empty<ReviewId, Review>() };
      case (?existing) { existing };
    };

    productReviews.add(reviewId, review);
    reviews.add(productId, productReviews);

    reviewId;
  };

  public query ({ caller }) func getProductReviews(productId : ProductId) : async [Review] {
    switch (reviews.get(productId)) {
      case (null) { [] };
      case (?productReviews) { productReviews.values().toArray().sort() };
    };
  };

  // Orders
  public shared ({ caller }) func placeOrder(customerName : Text, phone : Text, address : Text, city : Text, items : [OrderItem], total : Price) : async OrderId {
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : OrderRecord = {
      id = orderId;
      customerName;
      phone;
      address;
      city;
      items;
      total;
      status = #pending;
      createdAt = Time.now();
    };

    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    let ordersArray = orders.values().toArray();
    ordersArray.sort(OrderRecord.compareByCreatedAt);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, status : OrderStatus) : async () {
    requireAdmin(caller);

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.status == #cancelled) { Runtime.trap("Cannot update cancelled order") };
        if (order.status == #delivered and status != order.status) { Runtime.trap("Cannot update delivered order") };

        let updatedOrder : OrderRecord = {
          id = order.id;
          customerName = order.customerName;
          phone = order.phone;
          address = order.address;
          city = order.city;
          items = order.items;
          total = order.total;
          status;
          createdAt = order.createdAt;
        };

        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Seed Data
  system func preupgrade() { () };

  system func postupgrade() {
    nextOrderId := 1;
    nextReviewId := 1;
    categories.clear();
    products.clear();
    reviews.clear();
    orders.clear();
    categories.add(
      "masculino",
      {
        id = "masculino";
        name = "Masculino";
        description = "Perfumes masculinos";
        image = null;
      },
    );
    categories.add(
      "feminino",
      {
        id = "feminino";
        name = "Feminino";
        description = "Perfumes femininos";
        image = null;
      },
    );
    categories.add(
      "unissex",
      {
        id = "unissex";
        name = "Unissex";
        description = "Perfumes unissex";
        image = null;
      },
    );

    products.add(
      "acquadi-gio",
      {
        id = "acquadi-gio";
        name = "Acqua di Gio";
        description = "Fragrância refrescante e sofisticada";
        category = "masculino";
        sizes = [{ size = 100; price = 5200 }];
        image = null;
        gender = #male;
        tags = ["refreshing", "sophisticated"];
        featured = true;
        inStock = true;
        inspiredBy = "Giorgio Armani";
        createdAt = Time.now();
      },
    );

    products.add(
      "dolcegabbana",
      {
        id = "dolcegabbana";
        name = "Dolce&Gabbana";
        description = "Perfume masculino clássico e elegante";
        category = "masculino";
        sizes = [{ size = 100; price = 4300 }];
        image = null;
        gender = #male;
        tags = ["refreshing", "classic"];
        featured = false;
        inStock = true;
        inspiredBy = "Dolce&Gabbana";
        createdAt = Time.now();
      },
    );
  };

  // Authorization
  func requireAdmin(caller : Principal) {
    if (caller == Principal.fromText("2vxsx-fae")) {
      return;
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };
};
