import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  public type GameType = { #addition; #subtraction; #multiplication; #division };

  public type AgeGroup = {
    #fiveSix;
    #sevenEight;
    #nineTen;
  };

  public type MathQuestion = {
    question : Text;
    answer : Int;
    gameType : GameType;
  };

  public type Difficulty = {
    #easy;
    #medium;
    #hard;
  };

  module Difficulty {
    public func compare(a : Difficulty, b : Difficulty) : Order.Order {
      switch (a, b) {
        case (#easy, #easy) { #equal };
        case (#easy, _) { #less };
        case (#medium, #easy) { #greater };
        case (#medium, #medium) { #equal };
        case (#medium, #hard) { #less };
        case (#hard, #hard) { #equal };
        case (#hard, _) { #greater };
      };
    };
  };

  public type GameResult = {
    correct : Nat;
    total : Nat;
    gameType : GameType;
    timeSpent : Nat;
    ageGroup : AgeGroup;
    difficulty : Difficulty;
  };

  module GameResult {
    public func compare(a : GameResult, b : GameResult) : Order.Order {
      Int.compare(a.correct, b.correct);
    };
  };

  public type LevelProgress = {
    completedLevels : Map.Map<Difficulty, Int>;
    earnedRewards : Map.Map<Difficulty, [Text]>;
  };

  module LevelProgress {
    public func compare(a : LevelProgress, b : LevelProgress) : Order.Order {
      let aTotal = a.completedLevels.size();
      let bTotal = b.completedLevels.size();
      Int.compare(aTotal, bTotal);
    };
  };

  public type UserProgress = {
    stars : Nat;
    attempts : Nat;
    lastPlayed : Time.Time;
    highScores : [GameResult];
  };

  module UserProgress {
    public func compare(a : UserProgress, b : UserProgress) : Order.Order {
      Int.compare(a.lastPlayed, b.lastPlayed);
    };
  };

  public type TimesTableProgress = {
    tables : Map.Map<Nat, Nat>;
    attempts : Map.Map<Nat, Nat>;
    lastPractice : ?Time.Time;
  };

  module TimesTableProgress {
    public func compareByLastPractice(a : TimesTableProgress, b : TimesTableProgress) : Order.Order {
      switch (a.lastPractice, b.lastPractice) {
        case (null, null) { #equal };
        case (null, _) { #less };
        case (_, null) { #greater };
        case (?aTime, ?bTime) { Int.compare(aTime, bTime) };
      };
    };
  };

  public type ProgressSummary = {
    score : Nat;
    attempts : Nat;
    stars : Nat;
    history : [GameResult];
  };

  module ProgressSummary {
    public func compare(a : ProgressSummary, b : ProgressSummary) : Order.Order {
      Nat.compare(a.score, b.score);
    };

    public func compareByAgeGroup(a : ProgressSummary, b : ProgressSummary) : Order.Order {
      compare(a, b);
    };
  };

  public type TimesTableSummary = {
    tableCorrect : Nat;
    totalQuestions : Nat;
    timeSpent : Nat;
    starsEarned : Nat;
    tableSpeed : [(Nat, Nat)];
  };

  public type PracticeUpdate = {
    correct : Nat;
    incorrect : Nat;
    currentStreak : Nat;
    timeBonus : ?Nat;
    starsEarned : ?Nat;
  };

  public type UserProfile = {
    name : Text;
    preferredAgeGroup : ?AgeGroup;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let progressData = Map.empty<Principal, UserProgress>();
  let timesTableProgressData = Map.empty<Principal, TimesTableProgress>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let levelProgressData = Map.empty<Principal, LevelProgress>();

  // User profile management
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

  // Core gameplay functions
  public shared ({ caller }) func submitResult(
    gameType : GameType,
    ageGroup : AgeGroup,
    correct : Nat,
    total : Nat,
    stars : Nat,
    difficulty : Difficulty,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit results");
    };

    let newResult : GameResult = {
      correct;
      total;
      gameType;
      timeSpent = 0;
      ageGroup;
      difficulty;
    };

    switch (progressData.get(caller)) {
      case (null) {
        let newProgress : UserProgress = {
          stars = stars;
          attempts = 1;
          lastPlayed = Time.now();
          highScores = [newResult];
        };
        progressData.add(caller, newProgress);
      };
      case (?progress) {
        let updatedStars = progress.stars + stars;
        let updatedHighScores = progress.highScores.concat([newResult]);
        let updatedProgress : UserProgress = {
          stars = updatedStars;
          attempts = progress.attempts + 1;
          lastPlayed = Time.now();
          highScores = updatedHighScores;
        };
        progressData.add(caller, updatedProgress);
      };
    };
  };

  public query ({ caller }) func getProgressSummary() : async [ProgressSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };

    switch (progressData.get(caller)) {
      case (null) { [] };
      case (?progress) {
        [{
          score = progress.stars;
          attempts = progress.attempts;
          stars = progress.stars;
          history = progress.highScores;
        }];
      };
    };
  };

  public shared ({ caller }) func getTimesTableSummary() : async ?TimesTableSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view times table progress");
    };

    switch (timesTableProgressData.get(caller)) {
      case (null) { null };
      case (?progress) {
        let totalCorrect = progress.tables.values().toArray().foldLeft(0, Nat.add);
        ?{
          tableCorrect = totalCorrect;
          totalQuestions = 0;
          timeSpent = 0;
          starsEarned = 0;
          tableSpeed = progress.tables.entries().toArray();
        };
      };
    };
  };

  public shared ({ caller }) func updatePracticeStats(table : Nat, correct : Nat, attempts : Nat) : async PracticeUpdate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update practice stats");
    };

    let _updatedProgress = switch (timesTableProgressData.get(caller)) {
      case (null) {
        let newProgress = {
          tables = Map.fromIter<Nat, Nat>([(table, correct)].values());
          attempts = Map.fromIter<Nat, Nat>([(table, attempts)].values());
          lastPractice = ?Time.now();
        };
        timesTableProgressData.add(caller, newProgress);
        newProgress;
      };
      case (?progress) {
        {
          tables = progress.tables;
          attempts = progress.attempts;
          lastPractice = ?Time.now();
        };
      };
    };

    {
      correct;
      incorrect = attempts - correct;
      currentStreak = correct;
      timeBonus = if (correct >= 10) { ?5 } else { null };
      starsEarned = if (attempts <= 12) { ?1 } else { null };
    };
  };

  public query ({ caller }) func getUserStats(userId : Principal) : async (Nat, Nat) {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own stats");
    };

    switch (progressData.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?progress) { (progress.stars, progress.attempts) };
    };
  };

  // Level Progress Management
  public shared ({ caller }) func recordLevelCompletion(difficulty : Difficulty, levelNumber : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record level completion");
    };

    let userLevelProgress = switch (levelProgressData.get(caller)) {
      case (null) {
        {
          completedLevels = Map.fromIter<Difficulty, Int>([(difficulty, levelNumber)].values());
          earnedRewards = Map.empty<Difficulty, [Text]>();
        };
      };
      case (?progress) {
        let updatedCompleted = progress.completedLevels;
        updatedCompleted.add(difficulty, levelNumber);
        {
          completedLevels = updatedCompleted;
          earnedRewards = progress.earnedRewards;
        };
      };
    };
    levelProgressData.add(caller, userLevelProgress);
  };

  public query ({ caller }) func getCompletedLevels(difficulty : Difficulty) : async ?Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view completed levels");
    };

    switch (levelProgressData.get(caller)) {
      case (null) { null };
      case (?progress) { progress.completedLevels.get(difficulty) };
    };
  };

  public shared ({ caller }) func addEarnedReward(difficulty : Difficulty, reward : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add rewards");
    };

    let updatedRewards = switch (levelProgressData.get(caller)) {
      case (null) {
        {
          completedLevels = Map.empty<Difficulty, Int>();
          earnedRewards = Map.fromIter<Difficulty, [Text]>([(difficulty, [reward])].values());
        };
      };
      case (?progress) {
        let existingRewards = switch (progress.earnedRewards.get(difficulty)) {
          case (null) { [reward] };
          case (?rewards) { rewards.concat([reward]) };
        };
        let updatedEarnedRewards = progress.earnedRewards;
        updatedEarnedRewards.add(difficulty, existingRewards);
        {
          completedLevels = progress.completedLevels;
          earnedRewards = updatedEarnedRewards;
        };
      };
    };

    levelProgressData.add(caller, updatedRewards);
  };

  public query ({ caller }) func getEarnedRewards(difficulty : Difficulty) : async ?[Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view earned rewards");
    };

    switch (levelProgressData.get(caller)) {
      case (null) { null };
      case (?progress) { progress.earnedRewards.get(difficulty) };
    };
  };
};
