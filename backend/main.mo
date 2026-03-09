import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";

actor {
  type Reflection = {
    title : Text;
    body : Text;
    timestamp : Time.Time;
  };

  type Template = {
    id : Nat;
    name : Text;
    previewImage : Text;
    description : Text;
  };

  type PortfolioItem = {
    reflection : Reflection;
    template : Template;
    hashtags : [Text];
    postTimestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  module Reflection {
    public func compareByTimestamp(a : Reflection, b : Reflection) : Order.Order {
      if (a.timestamp < b.timestamp) { #less } else if (a.timestamp > b.timestamp) {
        #greater;
      } else { #equal };
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let reflections = Map.empty<Principal, List.List<Reflection>>();
  let portfolioItems = Map.empty<Principal, List.List<PortfolioItem>>();
  let templates = List.empty<Template>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  public query ({ caller }) func getReflection() : async [Reflection] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access reflections");
    };
    switch (reflections.get(caller)) {
      case (null) { [] };
      case (?reflectionList) { reflectionList.toArray() };
    };
  };

  public query ({ caller }) func getTemplates() : async [Template] {
    templates.toArray();
  };

  public query ({ caller }) func getPortfolio() : async [PortfolioItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access portfolio");
    };
    switch (portfolioItems.get(caller)) {
      case (null) { [] };
      case (?itemsList) { itemsList.toArray() };
    };
  };

  public query ({ caller }) func getPortfolioByHashtag(hashtag : Text) : async [PortfolioItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access portfolio");
    };
    switch (portfolioItems.get(caller)) {
      case (null) { [] };
      case (?items) {
        items.filter(func(item) { item.hashtags.find(func(h) { h == hashtag }) != null }).toArray();
      };
    };
  };

  public query ({ caller }) func getFilteredReflections(searchTerm : Text) : async [Reflection] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access reflections");
    };
    switch (reflections.get(caller)) {
      case (null) { [] };
      case (?refList) {
        refList.filter(
          func(reflection) {
            reflection.title.contains(#text searchTerm) or reflection.body.contains(#text searchTerm);
          }
        ).toArray();
      };
    };
  };

  public shared ({ caller }) func saveReflection(reflection : Reflection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save reflections");
    };
    let newReflection = {
      title = reflection.title;
      body = reflection.body;
      timestamp = Time.now();
    };
    switch (reflections.get(caller)) {
      case (null) {
        let newList = List.singleton<Reflection>(newReflection);
        reflections.add(caller, newList);
      };
      case (?reflectionList) {
        reflectionList.add(newReflection);
      };
    };
  };

  public shared ({ caller }) func updateReflection(reflection : Reflection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update reflections");
    };
    let updatedReflection = {
      title = reflection.title;
      body = reflection.body;
      timestamp = Time.now();
    };
    switch (reflections.get(caller)) {
      case (null) { Runtime.trap("No existing reflection found for update") };
      case (?reflectionList) {
        let updatedList = reflectionList.filter(
          func(existing) { existing.title != reflection.title }
        );
        updatedList.add(updatedReflection);
        reflections.add(caller, updatedList);
      };
    };
  };

  public shared ({ caller }) func generatePoster(reflection : Reflection, templateId : Nat, hashtags : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate posters");
    };
    let selectedTemplate = switch (templates.find(func(t) { t.id == templateId })) {
      case (null) { Runtime.trap("Template not found") };
      case (?template) { template };
    };
    let portfolioItem = {
      reflection;
      template = selectedTemplate;
      hashtags;
      postTimestamp = Time.now();
    };
    switch (portfolioItems.get(caller)) {
      case (null) {
        let newList = List.singleton<PortfolioItem>(portfolioItem);
        portfolioItems.add(caller, newList);
      };
      case (?items) {
        items.add(portfolioItem);
      };
    };
  };

  public query ({ caller }) func getLastReflections(count : Nat) : async [Reflection] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access reflections");
    };
    switch (reflections.get(caller)) {
      case (null) { [] };
      case (?refList) {
        let sortedReflections = refList.toArray().sort(Reflection.compareByTimestamp);
        let safeCount = if (sortedReflections.size() < count) { sortedReflections.size() } else {
          count;
        };
        Array.tabulate(
          safeCount,
          func(i) {
            sortedReflections[i];
          },
        );
      };
    };
  };
};
