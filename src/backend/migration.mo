import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  type Difficulty = { #easy; #medium; #hard };

  type OldGameResult = {
    correct : Nat;
    total : Nat;
    gameType : { #addition; #subtraction; #multiplication; #division };
    timeSpent : Nat;
    ageGroup : {
      #fiveSix;
      #sevenEight;
      #nineTen;
    };
  };

  type OldUserProgress = {
    stars : Nat;
    attempts : Nat;
    lastPlayed : Time.Time;
    highScores : [OldGameResult];
  };

  type NewGameResult = {
    correct : Nat;
    total : Nat;
    gameType : { #addition; #subtraction; #multiplication; #division };
    timeSpent : Nat;
    ageGroup : {
      #fiveSix;
      #sevenEight;
      #nineTen;
    };
    difficulty : Difficulty;
  };

  type NewUserProgress = {
    stars : Nat;
    attempts : Nat;
    lastPlayed : Time.Time;
    highScores : [NewGameResult];
  };

  type LevelProgress = {
    completedLevels : Map.Map<Difficulty, Int>;
    earnedRewards : Map.Map<Difficulty, [Text]>;
  };

  type OldActor = {
    progressData : Map.Map<Principal, OldUserProgress>;
  };

  type NewActor = {
    progressData : Map.Map<Principal, NewUserProgress>;
    levelProgressData : Map.Map<Principal, LevelProgress>;
  };

  public func run(old : OldActor) : NewActor {
    let newProgressData = old.progressData.map<Principal, OldUserProgress, NewUserProgress>(
      func(_id, oldProgress) {
        {
          oldProgress with
          highScores = oldProgress.highScores.map(
            func(oldResult) {
              { oldResult with difficulty = #easy };
            }
          )
        };
      }
    );
    let newLevelProgressData = Map.empty<Principal, LevelProgress>();

    {
      progressData = newProgressData;
      levelProgressData = newLevelProgressData;
    };
  };
};
