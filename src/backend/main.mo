import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Char "mo:core/Char";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    walletAddress : ?Text;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      switch (Text.compare(a.name, b.name)) {
        case (#equal) { Text.compare(debug_show a.walletAddress, debug_show b.walletAddress) };
        case (other) { other };
      };
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  func isWalletAddressValid(address : Text) : Bool {
    let chars = address.toArray();
    if (chars.size() != 66) { return false };

    if (chars[0] != '0' or chars[1] != 'x') { return false };

    func isValidChar(c : Char) : Bool {
      let validNumbers = "0123456789".toArray();
      let validLowercase = "abcdef".toArray();
      let validUppercase = "ABCDEF".toArray();

      func isValidNumber(x : Char) : Bool {
        x == c;
      };

      func isValidLower(x : Char) : Bool {
        x == c;
      };

      func isValidUpper(x : Char) : Bool {
        x == c;
      };

      var index = 0;
      while (index < validNumbers.size()) {
        if (isValidNumber(validNumbers[index])) { return true };
        index += 1;
      };

      index := 0;
      while (index < validLowercase.size()) {
        if (isValidLower(validLowercase[index])) { return true };
        index += 1;
      };

      index := 0;
      while (index < validUppercase.size()) {
        if (isValidUpper(validUppercase[index])) { return true };
        index += 1;
      };

      false;
    };

    // must only contain valid chars after 0x prefix
    var i = 2;
    while (i < chars.size()) {
      if (not isValidChar(chars[i])) { return false };
      i += 1;
    };

    true;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
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

  public shared ({ caller }) func linkWalletAddress(walletAddress : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can link wallet addresses");
    };
    if (not isWalletAddressValid(walletAddress)) {
      Runtime.trap("Invalid wallet address");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile = { name = profile.name; walletAddress = ?walletAddress };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getCurrentWalletAddress() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access wallet addresses");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { profile.walletAddress };
    };
  };

  public shared ({ caller }) func unlinkWalletAddress() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlink wallet addresses");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile = { name = profile.name; walletAddress = null };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateUserProfile(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    if (name.size() == 0) {
      Runtime.trap("Name cannot be empty");
    };
    let profile = {
      name;
      walletAddress = null;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getWalletAddress(user : Principal) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access wallet addresses");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own wallet address");
    };
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) { profile.walletAddress };
    };
  };

  public shared ({ caller }) func updateWalletAddress(walletAddress : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update wallet addresses");
    };
    if (not isWalletAddressValid(walletAddress)) {
      Runtime.trap("Invalid wallet address");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile = { name = profile.name; walletAddress = ?walletAddress };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.values().toArray().sort();
  };

  public shared ({ caller }) func clearUserProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear profiles");
    };
    userProfiles.remove(caller);
  };

  public query ({ caller }) func getProfile(user : Principal) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?userProfile) { userProfile };
    };
  };
};
