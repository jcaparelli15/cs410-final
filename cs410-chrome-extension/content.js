/**
 * This file handles the content script  logic.
 * Upon receiving a message containing the query from the popup window it performs bm25
 * treating each paragraph as a doc with set hyperparams.  It then returns the best matching paragraph and 
 * redirects the users browser to this section.  This section is also highlighted in blue
*/

const body = document.querySelector("body");
const documents = document.querySelectorAll("p");
const B_HYPERPARAM = .75
const K1_HYPERPARAM = 1.2

chrome.runtime.onMessage.addListener(msgObj => {
    for (let i = 0; i < docs.length; i++) {
      docs[i].style.color = "black";
    }
    let doc = getBestDoc(msgObj.text, documents, B_HYPERPARAM, K1_HYPERPARAM)
    doc.scrollIntoView({behavior: 'smooth'})
    doc.style.color = "blue"
    console.log(msgObj.text);
});

/**
 * This returns the number of docs in the collection
 * @param  {NodeList<Element> } docs A list of Element objects
 * @return {Number} The number of docs in the collection
 */
function getNumberOfDocs(docs){
  return docs.length;
}

/**
 * This returns the length of a docs in the collection
 * @param  {Element} doc The document in question
 * @return {Number} The length of this document
 */
function getDocumentLength(doc){
  return doc.textContent.split(" ").length
}

/**
 * This returns the average length of the  docs in the collection
 * @param  {NodeList<Element> } docs A list of Element objects
 * @return {Number} The average length of this collection
 */
function getAverageDocumentLength(docs){
  let sum = 0;
  for (let i = 0; i < docs.length; i++) {
    sum = sum + getDocumentLength(docs[i]);
  }
  return sum/docs.length;
}

/**
 * This returns the frequency of a term in a doc
 * @param  {String} term The query term 
 * @param  {NodeList<Element>} doc An Element object
 * @return {Number} The count of the term in the doc
 */
function countTermInDoc(term, doc){
  let terms = doc.textContent.split(" ");
  let count = 0
   for (let i = 0; i < terms.length; i++) {
     let q1 = term.toLowerCase();
     let d1 = terms[i].toLowerCase();
    if (q1 === d1){
      count = count + 1;
    }
  }
  return count;
}

/**
 * This returns the Inverse Document Frequency of a term in a doc
 * @param  {String} term The query term 
 * @param  {NodeList<Element>} docs A list of Element object
 * @return {Number} The IDF
 */
function getInverseDocumentFrequency(term, docs){

  let N = getNumberOfDocs(docs);
  let n = 0;
  for (let i = 0; i < docs.length; i++) {
    if (countTermInDoc(term, docs[i])>0){
      n = n + 1;
    }
  }
  return Math.log((N - n + 0.5)/(n + 0.5)+ 1);
}

/**
 * This returns the Inverse Document Frequency of a term in a doc
 * @param  {String} term The query term 
 * @param  {NodeList<Element>} docs A list of Element object
 * @return {Number} The IDF
 */
function scoreQueryTerm(term, doc, docs, b, k){
  let idf = getInverseDocumentFrequency(term, docs);
  let count = countTermInDoc(term, doc);
  let averageDocumentLength = getAverageDocumentLength(docs);
  let D = getNumberOfDocs(docs);
  let b_expression = 1 - b + (b * (D/averageDocumentLength));
  let numerator = count * (k + 1)
  let denominator = count + (k * b_expression)
  let fraction = numerator/denominator;
  let score = idf * fraction
  return score
}

/**
 * This returns the score of a document in the collection
 * @param  {String} query A search query
 * @param  {Element} doc  A doc object
 * @param  {NodeList<Element>} docs A list of Element object
 * @param {Number} B - One of BM25 Hyper parameter
 * @param {Number} K - One of BM25s Hyperparameter

 * @return {Number} The score of a document according to BM25
 */
function scoreDoc(query, doc, docs, b, k){
  let score = 0
  queryTerms = query.split(" ");
   for (let i = 0; i < queryTerms.length; i++) {
     score = score + scoreQueryTerm(queryTerms[i], doc, docs, b, k);
  }
  return score;
}

/**
 * This returns the  of a document scorelength of the  docs in the collection
 * @param  {String} query A search query
 * @param  {NodeList<Element>} docs A list of Element object
 * @param {Number} B - One of BM25 Hyper parameter
 * @param {Number} K - One of BM25s Hyperparameter

 * @return {Map} Each doc and its corresponding BM25 score
 */
function scoreDocs(query, docs, b, k){
  scoreMap = new Map();
  for (let i = 0; i < docs.length; i++) {
     score = scoreDoc(query, docs[i], docs, b, k);
     scoreMap.set(i, score);
  }
  return scoreMap
}

/**
 * This returns the best document in the collection with tiebreaks done on recency
 * @param  {String} query A search query
 * @param  {NodeList<Element>} docs A list of Element object
 * @param {Number} B - One of BM25 Hyper parameter
 * @param {Number} K - One of BM25s Hyperparameter

 * @return {Element} The most relevant document according to BM25
 */
function getBestDoc(query, docs, b, k){
  scoreMap = scoreDocs(query, docs, b, k);
  maxDocIndex = [...scoreMap.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)[0];
  return docs[maxDocIndex];
}