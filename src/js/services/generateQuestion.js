import questions from "pdd_russia/questions.json";
const questionsImg = [];

questionsImg.push({})
questions.forEach(item => {
  item.tickets.forEach(ticket => {
    questionsImg[ticket.image] = require(`pdd_russia/${ticket.image}`).default;
  })
})

export function generateQuestions() {
  const maxTickets = 20;
  const questionsInSection = 4;
  const usedSections = [];
  let filteredQuestions = [];

  for (let i = 0; i < maxTickets;) {
    let lastFilteredQuestionIndex;
    let randomSectionIndex;
    let section;

    while(true) {
      randomSectionIndex = random(0, questions.length - 1);
      section = questions[randomSectionIndex];

      if(!includesInUsedSections(usedSections, randomSectionIndex)) {
        filteredQuestions.push({
          title: section.section,
          tickets: []
        });
        usedSections.push({
          index: randomSectionIndex,
          ticketsIndex: []
        });

        lastFilteredQuestionIndex = filteredQuestions.length - 1;
        break;
      }
    }

    for (let j = 0; j < section.tickets.length; j++) {
      if (j === questionsInSection) break;

      let usedTicketsIndex = usedSections[lastFilteredQuestionIndex].ticketsIndex;
      let randomQuestionIndex = random(0, section.tickets.length - 1);
      while(true) {
        randomQuestionIndex = random(0, section.tickets.length - 1);

        if(!usedTicketsIndex.includes(randomQuestionIndex)) {
          break;
        }
      }

      const ticket = section.tickets[randomQuestionIndex];
      
      filteredQuestions[lastFilteredQuestionIndex].tickets.push(ticket);
      usedTicketsIndex.push(randomQuestionIndex);
      i++;
    }
  }

  filteredQuestions = removeNeccessarySymbolsInSectionTitle(filteredQuestions);
  filteredQuestions = addImagesToTickets(filteredQuestions);

  return filteredQuestions;
} 

/**
 * @description Generates random numbers from min to max
 * @param { Number } min - min number
 * @param { Number } max - max number
 * @returns { Number }
 */
function random(min, max) {
  let rand = min + Math.random() * (max - min);
  return Math.round(rand);
}

/**
 * @description Checks if a section has been used
 * @param { Array } usedSections - used sections
 * @param { Number } index - index
 * @returns { Boolean }
 */
function includesInUsedSections(usedSections, index) {
  for(let i = 0; i < usedSections.length; i++) {
    if (usedSections[i].index === index) {
      return true;
    }
  }
  
  return false;
}

/**
 * @description Remove string "(...any string...)"
 * @param { Array } filteredQuestions 
 * @returns { Array }
 */
function removeNeccessarySymbolsInSectionTitle(filteredQuestions) {
  filteredQuestions.forEach(item => {
    const newTitleArr = item.title.split(/ \(/g);
    if (newTitleArr.length > 1) {
      item.title = newTitleArr[0];
    }
  });

  return filteredQuestions;
}

/**
 * @description Remove string "(...any string...)"
 * @param { Array } filteredQuestions 
 * @returns { Array }
 */
function addImagesToTickets(filteredQuestions) {
  filteredQuestions.forEach(item => {
    item.tickets.forEach(ticket => {
      if (ticket.image) {
        ticket.image = questionsImg[ticket.image];
      }
    })
  }) 

  return filteredQuestions;
}
