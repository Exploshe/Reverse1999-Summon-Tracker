function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

if (limitedLifetimePulls = localStorage.getItem("limitedLifetimePulls")) {
    document.querySelector(".js-limited-lifetime-pulls").innerHTML = limitedLifetimePulls;
    document.querySelector(".js-limited-clear-drop-count").innerHTML = numberWithCommas(limitedLifetimePulls * 180);
};
if (limitedBanner6StarPity = localStorage.getItem("limitedBanner6StarPity")) {
    document.querySelector(".js-limited-6star-pity").innerHTML = limitedBanner6StarPity;
};
if (limitedBanner5StarPity = localStorage.getItem("limitedBanner5StarPity")) {
    document.querySelector(".js-limited-5star-pity").innerHTML = limitedBanner5StarPity;
};