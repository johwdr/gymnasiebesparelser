import Dictionary from "./components/dictionary/dictionary";
import '../styles/styles.scss';
// import '../assets/**/*.*';
// import '../styles/styles.scss';

console.log('Hello again Parcels', process.env.DEBUGGING);

const dictionaryEls = document.querySelectorAll('[data-gymnasium-lookup]');

const els = []

for (let n = 0; n < dictionaryEls.length; n++) {
    const el = dictionaryEls[n];

    const dictionary = new Dictionary(el);
}

/*
let ex = new Dictionary();
*/