// Minimum DOM fixtures required by module-level code in src/scripts
document.body.innerHTML = `
    <header id="header"></header>
    <footer id="footer"></footer>
    <ul id="letters__list"></ul>
    <div id="letters"></div>
    <button id="toggleHeaderFooter"><svg></svg><svg hidden="true"></svg></button>
    <button id="toggleButtonText"><svg></svg><svg hidden="true"></svg></button>
    <span class="js-canHide"></span>
    <table id="words__grid"><tbody></tbody></table>
`
