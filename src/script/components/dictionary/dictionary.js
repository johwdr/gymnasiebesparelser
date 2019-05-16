'use strict';

export default class Dictionary {
    constructor(el) {

        this.wrapper = el;
        console.dir(el);
        this.url = el.dataset.gymnasiumLookup;
        this.listElements = [];
        this.selectedLine = -1;

        this.getData(this.url)
        .then((data) => {


            return data.json();
        })
        .then((json) => {

            this.data = this.formatData(json);
            this.build()
        })

    }
    formatData(json) {
        const dictionary = [];
        const lines = json.data;

        lines.forEach(line => {
            dictionary.push([line['ord'], line['forklaring']]);
        })
        return lines;
    }

    build() {

        this.input = document.createElement('input');
        this.input.placeholder = this.wrapper.dataset.lookupPlaceholder || 'Søg';
        this.input.addEventListener('keyup', (event) => {

            //this.listElement.innerHTML = ''
            this.handleInput(event);

        })

        this.wrapper.appendChild(this.input);



        this.listElementWrapper = document.createElement('div');
        this.listElementWrapper.classList.add('dict-search-list-wrapper')

        this.listElement = document.createElement('ul');
        this.listElement.classList.add('dict-search-list')
        this.listElement.addEventListener('click', (event) => {
            this.handleClick(event)
        })

        this.listElementWrapper.appendChild(this.listElement);

        this.wrapper.appendChild(this.listElementWrapper);

        if (this.wrapper.dataset && 'tip' in this.wrapper.dataset) {

            this.tip = document.createElement('div');
            this.tip.classList.add('dict-tip');
            this.tip.innerText = this.wrapper.dataset.tip;
            this.wrapper.appendChild(this.tip);
        }

        this.resultElement = document.createElement('div');
        this.resultElement.classList.add('dict-result')


        this.wrapper.appendChild(this.resultElement);
        this.about = document.querySelector('[data-lookup-about]');
        if (this.about) {

            this.openInfoLink = document.createElement('a');
            this.openInfoLink.classList.add('dict-info-link');
            this.openInfoLink.href="#"
            this.openInfoLink.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><title>info</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M14,28A14,14,0,1,1,28,14,14,14,0,0,1,14,28ZM14,1.45A12.55,12.55,0,1,0,26.55,14,12.56,12.56,0,0,0,14,1.45Z"/><path class="cls-1" d="M14,8.66A1.18,1.18,0,1,1,14,6.3a1.18,1.18,0,1,1,0,2.36Zm1,11.46H13V10.61H15Z"/></g></g></svg>
            `
            this.wrapper.appendChild(this.openInfoLink);
            this.openInfoLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleInfo(event)
            })
        }

        if (this.wrapper.dataset && 'container' in this.wrapper.dataset) {
            this.container = document.getElementById(this.wrapper.dataset.container);
        }
    }

    getData(url) {
        return fetch(url)
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch(() => {

        })
    }

    toggleInfo(event) {


        if (this.openInfoLink.classList.contains('dict-info-link-open')) {
            this.openInfoLink.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><title>info</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M14,28A14,14,0,1,1,28,14,14,14,0,0,1,14,28ZM14,1.45A12.55,12.55,0,1,0,26.55,14,12.56,12.56,0,0,0,14,1.45Z"/><path class="cls-1" d="M14,8.66A1.18,1.18,0,1,1,14,6.3a1.18,1.18,0,1,1,0,2.36Zm1,11.46H13V10.61H15Z"/></g></g></svg>
            `

        } else {
            this.openInfoLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><title>luk</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><rect class="cls-1" x="-4.67" y="12.29" width="35.34" height="1.43" transform="translate(-5.38 13) rotate(-45)"/><rect class="cls-1" x="12.29" y="-4.67" width="1.43" height="35.34" transform="translate(-5.38 13) rotate(-45)"/></g></g></svg>
            `
        }
        this.about.classList.toggle('dict-open')
        if (this.container) {

            this.about.style.minHeight = this.container.offsetHeight + 'px';

            console.log('this.about.style', this.about.style)
        }

        this.openInfoLink.classList.toggle('dict-info-link-open');
    }



    filterData(text) {
        const hits = [];

        for (let n = 0; n < this.data.length; n++) {
            const line = this.data[n];
            console.log(line)
            var regex = new RegExp( text, 'gi' );
            if (line['school'].match(regex)) {
                console.log(line)
                hits.push(line)
            }
        }
        return hits;
    }

    updateSelected() {
        for (let i = 0; i < this.listElements.length; i++){
            this.listElements[i].classList.remove('key-selected');
            if (i === this.selectedLine) {
                this.listElements[i].classList.add('key-selected');
            }
        }
    }

    handleInput(event) {

        if (event.keyCode === 40) { // DOWN-ARROW
            if(this.selectedLine < this.listElements.length-1) this.selectedLine ++;
            this.updateSelected();
            event.preventDefault();
        } else if (event.keyCode === 38) { // UP-ARROW

            if(this.selectedLine > 0 ) this.selectedLine --;
            this.updateSelected();
            event.preventDefault();
        } else if (event.keyCode === 13) { // ENTER
            // console.log('Enter', this.selectNumber, this.searchresult[this.selectNumber].kommune);
            console.log(this.selectedLine, this.list)
            this.select(this.list[this.selectedLine]);
        } else {

            this.updateSuggestions()
        }
        //selectAll('li', this.searchList).classList.remove('key-selected');
        /*let li = selectAll('li', this.searchList);
        for (let i = 0, l = li.length ; i < l ; i++){
            li[i].classList.remove('key-selected');
            if (i===this.selectNumber) {
                li[i].classList.add('key-selected');
            }
        }*/



    }
    updateSuggestions() {

        this.tip.style.visibility = 'hidden';

        if (!this.inThrottle) {
            this.inThrottle = true;
            setTimeout(() => {
                this.inThrottle = false;
                this.listElement.innerText = '';
                this.listElements = [];
                this.list = [];
                if (this.input.value.length > 0) {
                    this.list = this.filterData(this.input.value);
                    this.list.forEach((item, index) => {
                        const li = document.createElement('li');
                        console.log(item)
                        let t = item['school'].toLowerCase().indexOf(this.input.value.toLowerCase());
                        li.innerHTML = item['school'].substr(0, t) + '<span class="highlight">' + item['school'].substr(t, this.input.value.length) + '</span>' + item['school'].substr(t+this.input.value.length);

                        li.dataset.index = index;
                        this.listElement.appendChild(li);
                        this.listElements.push(li);
                    })
                }
                const rect = this.listElement.getBoundingClientRect();
                document.body.style.minHeight = Math.ceil(rect.top + rect.height + 10) + 'px'
                //console.log(rect);

            }, 100);
        }
    }
    handleClick(event) {
        const index = event.target.dataset.index;
        this.select(this.list[index]);
    }

    isNegative(val) {

        return val.indexOf('-') < 0;
    }
    directionText(val) {

        return (val.indexOf('-') < 0) ? 'flere': 'færre';
    }
    select(item) {

        const arrow = `<svg class="stats-direction-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.93 41.7"><g id="Layer_2" data-name="Layer 2"><g id="tekst"><line class="arrow-line" x1="12.97" y1="1.28" x2="12.97" y2="41.7"/><polyline class="arrow-line" points="0.35 13.32 12.97 0.71 25.58 13.32"/></g></g></svg>`

        let teacherpctArrow = this.isNegative(item['teacherpct']) ? 'arrow-down': 'arrow-up';
        let studentpctArrow = this.isNegative(item['studentpct']) ? 'arrow-down' : 'arrow-up';
        let ratiopctArrow = this.isNegative(item['ratiopct']) ? 'arrow-down' : 'arrow-up';


        let teacherDirection = this.directionText(item['teacherpct']);
        let studentDirection = this.directionText(item['studentpct']);
        let ratioDirection = this.directionText(item['ratiopct']);

        this.tip.style.display = 'none';
        this.input.value = ''
        this.listElement.innerHTML = '';
        this.resultElement.innerHTML = `
            <h4>${item['school']}</h4>
            <div class="stats-line">

                <div class="stats-line-digit ${teacherpctArrow}"><span class="stats-digit-wrapper">${item['teacherpct']}</span> ${arrow}</div>
                <p class="stats-line-label">${teacherDirection} lærere</p>
                <p class="stats-line-info">(Hele landet: -9%)</p>
            </div>
            <div class="stats-line">

                <div class="stats-line-digit ${studentpctArrow}"><span class="stats-digit-wrapper">${item['studentpct']}</span> ${arrow}</div>
                <p class="stats-line-label">${studentDirection} elever</p>
                <p class="stats-line-info">(Hele landet: -1%)</p>
            </div>
            <div class="stats-line">

                <div class="stats-line-digit ${ratiopctArrow}"><span class="stats-digit-wrapper">${item['ratiopct']}</span> ${arrow}</div>
                <p class="stats-line-label">${ratioDirection} lærere pr elev:</p>
                <p class="stats-line-info">(Hele landet: -8%)</p>
            </div>
            <div class="stats-footnotes">
                <p>Der er tale om antal lærerårsværk og antal årselever. Et lærerårsværk dækker både over timelønnede og fastansatte lærere. Mindre faggrupper, der også kan undervise på gymnasiet, er ikke talt med. En årselev er en elev, der modtager 40 ugers fuldtidsundervisning.</p>
                <p>Kilde: Undervisningsministeriet og Gymnasieskolernes Lærerforening.</p>

            </div>
        `;/*
        if (!this.restart) {
            this.restart = document.createElement('a');

            this.restart.href="#"
            this.restart.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.54 23.71"><title>forfra</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M9.27,5.17H5.68L9.43,1.41,8,0,1.55,6.47l6.5,6.45L9.46,11.5,5.09,7.17H9.27A7.27,7.27,0,1,1,2,14.44H0A9.27,9.27,0,1,0,9.27,5.17Z"/></g></g></svg>
            `;
            this.restart.classList.add('dict-restart');
            this.restart.addEventListener('click', (event) => {
                event.preventDefault();
                this.resultElement.innerHTML = ''
                this.restart.remove();
                this.restart = null;
                this.tip.style.display = 'block';
                this.tip.style.visibility = 'visible';
            })
            this.wrapper.appendChild(this.restart);
        }*/

    }
}
