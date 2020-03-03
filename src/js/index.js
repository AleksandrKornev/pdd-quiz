/* polifylls */
import "core-js/stable";
import "regenerator-runtime/runtime";

import { generateQuestions } from "./services/generateQuestion";

let questions = generateQuestions();

const maxQuestion = 20;
const needRightQuestion = 18;
const questionInSection = 4;

let result = [];
let sectionIndex = 0;
let questionIndex = 0;
let allQuestuionIndex = 0;

onload();

function onload() {
  $(".step__name__confirm").on("click", confrim);
  $(".step__quiz__confirm").on("click", next);
  $(".step__result__repeat").on("click", reset);

  renderQuestion();
}

function reset() {
  result = [];
  sectionIndex = 0;
  questionIndex = 0;
  allQuestuionIndex = 0;

  questions = generateQuestions();

  $(".step__name__input").val("");
  $(".step__name").show();
  $(".step__quiz").hide();
  $(".step__result").hide();

  $("#input1").prop("checked", false);
  $("#input2").prop("checked", false);
  $("#input3").prop("checked", false);

  $(".step__result__row_answer").html("");
}

function confrim() {
  const name = $(".step__name__input").val();
  if (!validate(name)) return;
  
  $(".step__name").hide();
  $(".step__quiz").show();
}

function validate(name) {
  if (name.length === 0) return false;
  return true;
}

function next() {
  if (!checkCondition() || !checkResult()) return;
  counterPlus();
  renderQuestion();
}

function checkCondition() {
  if (allQuestuionIndex >= maxQuestion - 1) {
    checkResult();
    renderResult();
    return false;
  }

  return true;
} 

function checkResult() {
  const ticket =  questions[sectionIndex].tickets[questionIndex];
  let choiced, isSuccess;

  const input1 = $("#input1").prop("checked");
  const input2 = $("#input2").prop("checked");
  const input3 = $("#input3").prop("checked");
  if (!input1 && !input2 && !input3) return false;

  if (input1) choiced = 1;
  else if (input2) choiced = 2;
  else if (input3) choiced = 3;

  if (choiced == ticket.correct) isSuccess = true;
  else isSuccess = false;

  result.push({
    choiced,
    isSuccess
  });

  return true;
}

function renderQuestion() {
  const ticket =  questions[sectionIndex].tickets[questionIndex];
  const title = ticket.title;
  const image = ticket.image;

  $(".step__quiz__title").text(title);
  $(".step__quiz__img").attr("src", image);
  $("#answerInput1").text(ticket.answers[0]);
  $("#answerInput2").text(ticket.answers[1]);
  $("#answerInput3").text(ticket.answers[2]);
  $("#input1").prop("checked", false);
  $("#input2").prop("checked", false);
  $("#input3").prop("checked", false);
}

function counterPlus() {
  if (questionIndex === questionInSection - 1) {
    questionIndex = 0;
    sectionIndex++;
    allQuestuionIndex++;
  } else {
    questionIndex++;
    allQuestuionIndex++;
  }
}

function renderResult() {
  const countRightAnswers = computedResults();
  
  addAnswerToResult();
  addResponseToResult(countRightAnswers);

  $(".max_number").text(maxQuestion);
  $(".right_answers").text(countRightAnswers);

  $(".step__quiz").hide();
  $(".step__result").show();
}

function computedResults() {
  let countRightAnswers = 0;

  result.forEach(answer => {
    if (answer.isSuccess) countRightAnswers++;
  })

  return countRightAnswers;
}

function addAnswerToResult() {
  result.forEach((item, index) => {
    const success = item.isSuccess;
    const iconClass = success ? "ok" : "remove";
    const colorClass = success ? "success" : "danger";
  
    $(".step__result__row_answer").append(`
    <div class="step__result__answer_item">
      <span class="step__result__answer_item__label label label-${ colorClass }">
        <span class="step__result__answer_item__label__number">${ index + 1 }</span>
        <span class="glyphicon glyphicon-${ iconClass }" aria-hidden="true"></span>
      </span>
    </div>
  `)
  });
}

function addResponseToResult(countRightAnswers) {
  const isSuccess = countRightAnswers >= needRightQuestion;
  const text = isSuccess ? "Сдали" : "Не сдали";
  const colorClass = isSuccess ? "success" : "error";

  $(".step__result__row_response__text").text(text);
  $(".step__result__row_response__text").addClass(colorClass);
}