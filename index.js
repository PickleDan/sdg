/**
 * ТРЕБОВАНИЕ:
 *
 * Необходимо реализовать функцию calculateLeaderboardPlaces.
 * Функция распределяет места пользователей, учитывая ограничения для получения первых мест и набранные пользователями очки.
 * Подробное ТЗ смотреть в readme.md

 * Файл preview.png носит иллюстративный характер, не нужно релизовывать UI!
 * Реализованную функцию прислать в виде js файла
 */

/**
 * ТЕХНИЧЕСКИЕ ОГРАНИЧЕНИЯ:
 *
 * количество очков это всегда целое положительное число
 * firstPlaceMinScore > secondPlaceMinScore > thirdPlaceMinScore > 0
 * в конкурсе участвует от 1 до 100 пользователей
 * 2 пользователя не могут набрать одинаковое количество баллов (разные баллы у пользователей гарантируются бизнес-логикой, не стоит усложнять алгоритм)
 * нет ограничений на скорость работы функции и потребляемую ей память
 * при реализации функции разрешается использование любых библиотек, любого стиля написания кода
 * в функцию передаются только валидные данные, которые соответствуют предыдущим ограничениям (проверять это в функции не нужно)
 */

/**
 * ВХОДНЫЕ ДАННЫЕ:
 *
 * @param users - это список пользователей и заработанные каждым из них очки,
 * это неотсортированный массив вида [{userId: "id1", score: score1}, ... , {userId: "idn", score: scoreN}], где score1 ... scoreN положительные целые числа, id1 ... idN произвольные неповторяющиеся идентификаторы
 *
 * @param minScores - это значения минимального количества очков для первых 3 мест
 * это объект вида { firstPlaceMinScore: score1, secondPlaceMinScore: score2, thirdPlaceMinScore : score3 }, где score1 > score2 > score3 > 0 целые положительные числа
 */

/**
 * РЕЗУЛЬТАТ:
 *
 * Функция должна вернуть пользователей с занятыми ими местами
 * Массив вида (сортировка массива не важна): [{userId: "id1", place: user1Place}, ..., {userId: "idN", place: userNPlace}], где user1Place ... userNPlace это целые положительные числа равные занятым пользователями местами, id1 ... idN идентификаторы пользователей из массива users
 */

function calculateLeaderboardPlaces(users, minScores) {
  const sortedUsers = [...users];
  sortedUsers.sort((a, b) => b.score - a.score);

  console.log("### users", users);

  const usersMap = sortedUsers.reduce((acc, item) => {
    acc[item.userId] = {
      possiblePlaces: getPossiblePlaces(item.score, minScores),
    };

    return acc;
  }, {});

  let currentPlace;
  const leaderboardList = [];

  for (const [key, value] of Object.entries(usersMap)) {
    const isEnoughPointsForPrizes = value.possiblePlaces.length !== 0;
    const maxPossiblePlace = isEnoughPointsForPrizes
      ? value.possiblePlaces[0]
      : null;

    const isFirstPlaceStillAvailable = isPlaceStillAvailable(
      leaderboardList,
      1,
    );
    const isSecondPlaceStillAvailable = isPlaceStillAvailable(
      leaderboardList,
      2,
    );
    const isThirdPlaceStillAvailable = isPlaceStillAvailable(
      leaderboardList,
      3,
    );

    let areLeadersFound = !isThirdPlaceStillAvailable;

    if (maxPossiblePlace === 1) {
      if (isFirstPlaceStillAvailable) {
        leaderboardList.push({
          userId: key,
          place: 1,
        });
        currentPlace = 1;
      } else if (isSecondPlaceStillAvailable) {
        leaderboardList.push({
          userId: key,
          place: 2,
        });
        currentPlace = 2;
      } else if (isThirdPlaceStillAvailable) {
        leaderboardList.push({
          userId: key,
          place: 3,
        });
        currentPlace = 3;
      }
    }

    if (maxPossiblePlace === 2) {
      if (isSecondPlaceStillAvailable) {
        leaderboardList.push({
          userId: key,
          place: 2,
        });
        currentPlace = 2;
      } else if (isThirdPlaceStillAvailable) {
        leaderboardList.push({
          userId: key,
          place: 3,
        });
        currentPlace = 3;
      }
    }

    if (maxPossiblePlace === 3) {
      if (isThirdPlaceStillAvailable) {
        leaderboardList.push({
          userId: key,
          place: 3,
        });
        currentPlace = 3;
      }
    }

    if (!isEnoughPointsForPrizes || areLeadersFound) {
      if (!currentPlace || currentPlace < 4) {
        currentPlace = 4;
      }

      leaderboardList.push({
        userId: key,
        place: currentPlace,
      });

      currentPlace++;
    }
  }

  console.log("### leaderboardList", leaderboardList);
  return leaderboardList;
}

// Функция определяет все возможные призовые места для юзера
const getPossiblePlaces = (score, minScores) => {
  const { firstPlaceMinScore, secondPlaceMinScore, thirdPlaceMinScore } =
    minScores;

  if (score >= firstPlaceMinScore) {
    return [1, 2, 3];
  } else if (score < firstPlaceMinScore && score >= secondPlaceMinScore) {
    return [2, 3];
  } else if (score < secondPlaceMinScore && score >= thirdPlaceMinScore) {
    return [3];
  } else return [];
};

// Проверка свободного призового места
const isPlaceStillAvailable = (leaderboard, place) => {
  return leaderboard.every((user) => user.place !== place);
};

const areLeadersFound = (
  isFirstPlaceStillAvailable,
  isSecondPlaceStillAvailable,
  isThirdPlaceStillAvailable,
) => {
  if (!isThirdPlaceStillAvailable) {
    return true;
  }
};

// функция-helper, ее модифицировать не нужно
function checkResult(answer, correctAnswer) {
  if (!answer) return false;
  if (!Array.isArray(answer)) return false;
  if (answer.length !== correctAnswer.length) return false;

  for (let i = 0; i < correctAnswer.length; i++) {
    const correctAnswerElement = correctAnswer[i];

    const answerElement = answer.find(
      (x) => x.userId === correctAnswerElement.userId,
    );
    if (!answerElement) return false;

    if (String(answerElement.place) !== String(correctAnswerElement.place))
      return false;
  }

  return true;
}

/**
 * Пример1:
 *
 * users = [{ userId: "id1", score: 3 }, { userId: "id2", score: 2 }, { userId: "id3", score: 1 }]
 * minScores = { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore : 10 }
 * Ожидаемый результат (любая сортировка внутри массива):
 * [{ userId: "id1", place: 4 }, { userId: "id2", place: 5 }, { userId: "id3", place: 6 } ] // Все пользователи не набрали достаточно очков для 1, 2 и 3го места, поэтому заняли места с 4 по 6.
 */
let result1 = calculateLeaderboardPlaces(
  [
    { userId: "id1", score: 3 },
    { userId: "id2", score: 2 },
    { userId: "id3", score: 1 },
  ],
  { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
  "test1",
  checkResult(result1, [
    { userId: "id1", place: 4 },
    { userId: "id2", place: 5 },
    { userId: "id3", place: 6 },
  ]),
);

/**
 * Пример2:
 *
 * users = [{ userId: "id1", score: 100 }, { userId: "id2", score: 3 }, { userId: "id3", score: 2 }, { userId: "id4", score: 1 }]
 * minScores = { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore : 10 }
 * Ожидаемый результат (любая сортировка внутри массива):
 * [{ userId: "id1", place: 1 }, { userId: "id2", place: 4 }, { userId: "id3", place: 5 }, { userId: "id4", place: 6 }] // только "id1" набрал достаточно очков для 1го места, все остальные в топ не вошли
 */
let result2 = calculateLeaderboardPlaces(
  [
    { userId: "id1", score: 100 },
    { userId: "id2", score: 3 },
    { userId: "id3", score: 2 },
    { userId: "id4", score: 1 },
  ],
  { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
  "test2",
  checkResult(result2, [
    { userId: "id1", place: 1 },
    { userId: "id2", place: 4 },
    { userId: "id3", place: 5 },
    { userId: "id4", place: 6 },
  ]),
);

/**
 * Пример3
 */
let result3 = calculateLeaderboardPlaces([{ userId: "id1", score: 55 }], {
  firstPlaceMinScore: 100,
  secondPlaceMinScore: 50,
  thirdPlaceMinScore: 10,
});
console.log("test3", checkResult(result3, [{ userId: "id1", place: 2 }]));

/**
 * Пример4
 */
let result4 = calculateLeaderboardPlaces(
  [
    { userId: "id1", score: 500 },
    { userId: "id2", score: 400 },
    { userId: "id3", score: 300 },
    { userId: "id4", score: 200 },
  ],
  {
    firstPlaceMinScore: 100,
    secondPlaceMinScore: 50,
    thirdPlaceMinScore: 10,
  },
);
console.log(
  "test4",
  checkResult(result4, [
    { userId: "id1", place: 1 },
    { userId: "id2", place: 2 },
    { userId: "id3", place: 3 },
    { userId: "id4", place: 4 },
  ]),
);

let result16 = calculateLeaderboardPlaces(
  [
    { userId: "id1", score: 13 },
    { userId: "id2", score: 12 },
    { userId: "id3", score: 11 },
    { userId: "id4", score: 5 },
  ],
  { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
  "test16",
  checkResult(result16, [
    { userId: "id1", place: 3 },
    { userId: "id2", place: 4 },
    { userId: "id3", place: 5 },
    { userId: "id4", place: 6 },
  ]),
);

let result17 = calculateLeaderboardPlaces(
  [
    { userId: "id1", score: 55 },
    { userId: "id2", score: 54 },
    { userId: "id3", score: 53 },
    { userId: "id4", score: 5 },
  ],
  { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
  "test17",
  checkResult(result17, [
    { userId: "id1", place: 2 },
    { userId: "id2", place: 3 },
    { userId: "id3", place: 4 },
    { userId: "id4", place: 5 },
  ]),
);

let result18 = calculateLeaderboardPlaces(
  [
    { userId: "id1", score: 101 },
    { userId: "id2", score: 100 },
    { userId: "id3", score: 10 },
    { userId: "id4", score: 5 },
  ],
  { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
  "result18",
  checkResult(result18, [
    { userId: "id1", place: 1 },
    { userId: "id2", place: 2 },
    { userId: "id3", place: 3 },
    { userId: "id4", place: 4 },
  ]),
);

let result19 = calculateLeaderboardPlaces(
  [
    { userId: "id1", score: 55 },
    { userId: "id2", score: 50 },
    { userId: "id3", score: 8 },
    { userId: "id4", score: 5 },
  ],
  { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
  "result19",
  checkResult(result19, [
    { userId: "id1", place: 2 },
    { userId: "id2", place: 3 },
    { userId: "id3", place: 4 },
    { userId: "id4", place: 5 },
  ]),
);

let result20 = calculateLeaderboardPlaces(
    [
        { userId: "id1", score: 120 },
        { userId: "id2", score: 115 },
        { userId: "id3", score: 110 },
        { userId: "id4", score: 105 },
    ],
    { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
    "result20",
    checkResult(result20, [
        { userId: "id1", place: 1 },
        { userId: "id2", place: 2 },
        { userId: "id3", place: 3 },
        { userId: "id4", place: 4 },
    ]),
);

let result21 = calculateLeaderboardPlaces(
    [
        { userId: "id1", score: 15 },
        { userId: "id2", score: 14 },
        { userId: "id3", score: 13 },
        { userId: "id4", score: 12 },
    ],
    { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
    "result21",
    checkResult(result21, [
        { userId: "id1", place: 3 },
        { userId: "id2", place: 4 },
        { userId: "id3", place: 5 },
        { userId: "id4", place: 6 },
    ]),
);

let result22 = calculateLeaderboardPlaces(
    [
        { userId: "id1", score: 101 },
        { userId: "id2", score: 9 },
        { userId: "id3", score: 8 },
        { userId: "id4", score: 7 },
    ],
    { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 },
);
console.log(
    "result22",
    checkResult(result22, [
        { userId: "id1", place: 1 },
        { userId: "id2", place: 4 },
        { userId: "id3", place: 5 },
        { userId: "id4", place: 6 },
    ]),
);





console.log("-----------------------------------------------------");
