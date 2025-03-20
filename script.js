var currentQ = 0;
var currentS = 0;
var current_q_id;
var all_question_list = [];
var all_question_id = 0;
var lastchangetiime = Date.now();
var endtime = Date.now() + totaltime;


// review
function markreview(q_id) {
    document.getElementById('currQuestionMarkForReviewLabel-' + q_id).classList.toggle('hideThis')
}
//clear
function clearQuestionOptions(questionId) {
    document.querySelectorAll(`input[name="questionOption-${questionId}"]`).forEach(radio => {
        radio.checked = false;
    });
}
//get selected option
function getSelectedOption(questionId) {
    const selectedOption = document.querySelector(`input[name="questionOption-${questionId}"]:checked`);
    if (selectedOption) {
        return selectedOption.value;
    } else {
        return null;
    }
}
//find question
function findthequestion(questionId, req) {
    if (req == 'index') {
        return all_question_list.findIndex(question => question.id === questionId);
    }
    else if (req == 'Question') {
        return user_responce[currentS].find(question => question.question_id === questionId);
    }
}
//navigate
const question_list = document.getElementsByClassName('questionLi');
function change(q_id) {
    goingoff(all_question_id);
    for (let A = 0; A < question_list.length; A++) {
        const question = question_list[A];
        question.classList.add('hideThis');
    }
    document.getElementById('questid-' + q_id).classList.remove('hideThis');
    current_q_id = q_id;
    all_question_id = findthequestion(q_id, 'index');
    currentS = all_question_list[all_question_id].subj;
    currentQ = all_question_list[all_question_id].Q_index;
    changesubj(currentS);
}
function previous() {
    if (all_question_id > 0) {
        change(all_question_list[all_question_id - 1].id);
    }
    else {
        alert('This is first Question.');
    }
}
function next() {
    if (all_question_id < (all_question_list.length - 1)) {
        change(all_question_list[all_question_id + 1].id);
    }
    else {
        alert('This is last Question.');
    }
}
//list to ease usease
function start() {
    var array = [];
    for (let A = 0; A < user_responce.length; A++) {
        const subject = user_responce[A];
        for (let B = 0; B < subject.length; B++) {
            //dispay
            const Question = subject[B];
            const id = Question.question_id;
            const li = document.createElement('quenavi');
            const span = document.createElement('div');
            span.append(B + 1);
            span.setAttribute('id', 'selector-' + id);
            span.setAttribute('style', 'background:#374957;');
            li.appendChild(span)
            li.setAttribute('class', 'question-selector sub-' + A);
            li.setAttribute('onclick', 'change(' + id + ')');
            document.getElementById('navigation-list').appendChild(li);
            //save to arry
            var Q = { id, subj: A, Q_index: B };
            array.push(Q);
        }
    }
    all_question_list = array;
}
//changing question
function goingoff(q_id) {
    var ismarked = false; var istobereviewed = false; var state = 1;
    const Q = all_question_list[q_id];
    var answeramarked = getSelectedOption(Q.id);
    if (answeramarked != null) {
        user_responce[Q.subj][Q.Q_index].answermarked = answeramarked;
        ismarked = true;
    }
    user_responce[Q.subj][Q.Q_index].timeTaken += timeofthequestion();
    var reviewstate = !(document.getElementById('currQuestionMarkForReviewLabel-' + Q.id).classList.contains('hideThis'));
    user_responce[Q.subj][Q.Q_index].ismarked = reviewstate;
    istobereviewed = reviewstate;
    if (!ismarked && !istobereviewed) { state = 2; document.getElementById('selector-' + Q.id).setAttribute('style', 'background:#FFC239 !important;') }
    if (ismarked && !istobereviewed) { state = 3; document.getElementById('selector-' + Q.id).setAttribute('style', 'background:#1273EB !important;') }
    if (!ismarked && istobereviewed) { state = 4; document.getElementById('selector-' + Q.id).setAttribute('style', 'background:#66CCF1 !important;') }
    if (ismarked && istobereviewed) { state = 5; document.getElementById('selector-' + Q.id).setAttribute('style', 'background:#66FFE2 !important;') }
    user_responce[Q.subj][Q.Q_index].status = state;
}
//change subject
function changesubj(sub) {
    const list = document.getElementsByClassName('question-selector');
    for (let A = 0; A < list.length; A++) {
        const Q_seletor = list[A];
        Q_seletor.classList.add('hideThis')
    }
    const fav_list = document.getElementsByClassName('sub-' + sub);
    for (let A = 0; A < fav_list.length; A++) {
        const Q_seletor = fav_list[A];
        Q_seletor.classList.toggle('hideThis')
    }
}
//time for question 
function timeofthequestion() {
    var timetaken = Date.now() - lastchangetiime;
    lastchangetiime = Date.now();
    return timetaken
}
//times
function timeoftheexam() {
    var timeleft = endtime - Date.now();
    var Min = (timeleft - timeleft % 60000) / 60000;
    var Sec = ((timeleft - (Min * 60000)) - (timeleft - (Min * 60000)) % 1000) / 1000;
    var timeto = Min + ':' + Sec + ' Min';
    var timebox = document.getElementsByClassName('timeLeftSpanId');
    for (let A = 0; A < timebox.length; A++) {
        const box = timebox[A];
        box.innerHTML = timeto;
    }
    const marks = document.getElementsByClassName('make-review');
    var countRM = 0;
    for (let A = 0; A < marks.length; A++) {
        const mark = marks[A];
        if (!mark.classList.contains('hideThis')) { countRM++; }
    }
    document.getElementById('totalReviewQuestionCountId').innerHTML = countRM;
    var countM = 0;
    for (let A = 0; A < all_question_list.length; A++) {
        const element = all_question_list[A];
        var state = user_responce[element.subj][element.Q_index].status;
        if (state == 3 || state == 5) {
            countM++;
        }
    }
    document.getElementById('totalAttemptedQuestionCountId').innerHTML = countM;
    document.getElementById('totalUnAttemptedQuestionCountId').innerHTML = all_question_list.length - countM;
}
setInterval(timeoftheexam, 100);
//activate
start();
change(all_question_list[0].id);
function submit() {
    goingoff(all_question_id)
    total = 0;
    for (let A = 0; A < user_responce.length; A++) {
        const subj = user_responce[A];
        var crrr = 0;
        for (let B = 0; B < (subj.length + 1); B++) {
            const tr = document.createElement('tr');
            if (B < subj.length) {
                const no = document.createElement('td');
                const cr = document.createElement('td');
                const ans = document.createElement('td');
                const st = document.createElement('td');
                const Question = subj[B];
                no.append(B + 1);
                cr.append(Question.actualAns);
                ans.append(Question.answermarked);
                const span = document.createElement('span');
                if (Question.status == 3 || Question.status == 5) { if (Question.actualAns == Question.answermarked) { span.append('+4'); crrr += 4 } else { span.append('-1'); crrr -= 1 } } else { span.append('0') }
                st.appendChild(span)
                tr.appendChild(no);
                tr.appendChild(cr);
                tr.appendChild(ans);
                tr.appendChild(st);
                tr.setAttribute('onclick', 'Qshow(' + Question.question_id + ',' + Question.actualAns + ',' + Question.answermarked + ')')
            }
            else if (B == subj.length) {
                tr.append(crrr);
            }
            if (A == 0) { document.getElementById('phy-result').appendChild(tr); }
            if (A == 1) { document.getElementById('chem-result').appendChild(tr); }
            if (A == 2) { document.getElementById('bio-result').appendChild(tr); }
        }
        total += crrr;
    }
    document.getElementById('totalresult').innerHTML = total + '/720';
    document.getElementById('result').style.display = 'block';
    navigator.clipboard.writeText(JSON.stringify(sendingof(user_responce)));
    alert('the result has been copied please save the text file for future use.')
}
//question show
function Qshow(q_id, correct, useranswer) {
    document.getElementById('questid-' + q_id).classList.remove('hideThis');
    document.getElementById('Q_is_showen_here').innerHTML = document.getElementById('questid-' + q_id).outerHTML;
    document.getElementById('correctanswertobeshown').innerHTML = correct;
    document.getElementById('useranswertobeshown').innerHTML = useranswer;
    document.getElementById('result-question').style.display = 'block';
}

function sendingof(array) {
    var result = {examid,starttime:(endtime-totaltime),user,result:[]};
    for (let A = 0; A < array.length; A++) {
        var subject = [];
        const sub = array[A];
        for (let B = 0; B < sub.length; B++) {
            const Q = sub[B];
            const state = (Q.status) ? (Q.status) : 1;
            const ans = (Q.answermarked) ? (Q.answermarked) : '~';
            var question = { Qid: Q.question_id, CA: Q.actualAns, S: state, UA: ans,TT:Q.timeTaken };
            subject.push(question);
        }
        result.result.push(subject);
    }
    return result
}
