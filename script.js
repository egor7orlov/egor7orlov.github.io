/* --------------------------------- Consts --------------------------------- */
const displayNoneClass = 'gone';
const zeroOpacityClass = 'invisible';

/* --------------------------------- Workers -------------------------------- */
const headerSqueezer = {
    squeezeHeader() {
        const header = document.querySelector('.header');
        const headSpacer = document.querySelector('#head-spacer');
        const logoContainer = document.querySelector('.logo-container');
        const phoneNumber = document.querySelector('.header .sales p');
        const getCallButton = document.querySelector('.header .get-call button');
        logoContainer.style.cursor = 'pointer';

        header.classList.remove('header-on-top');
        headSpacer.classList.remove('header-on-top');
        logoContainer.classList.remove('logo-on-top');
        phoneNumber.classList.add(zeroOpacityClass);
        getCallButton.classList.add(zeroOpacityClass);
    },

    expandHeader() {
        const header = document.querySelector('.header');
        const headSpacer = document.querySelector('#head-spacer');
        const logoContainer = document.querySelector('.logo-container');
        const phoneNumber = document.querySelector('.header .sales p');
        const getCallButton = document.querySelector('.header .get-call button');
        logoContainer.style.cursor = 'default';

        header.classList.add('header-on-top');
        headSpacer.classList.add('header-on-top');
        logoContainer.classList.add('logo-on-top');
        phoneNumber.classList.remove(zeroOpacityClass);
        getCallButton.classList.remove(zeroOpacityClass);
    }
};
const scroller = {
    scrollToTop() {
        this._smoothScrollToTopOnSafari();
        this._smoothScrollToTopOnNonSafari();
    },

    _smoothScrollToTopOnSafari() {
        this._smoothScrollToTop(document.body.scrollTop);
    },

    _smoothScrollToTopOnNonSafari() {
        this._smoothScrollToTop(document.documentElement);
    },

    _smoothScrollToTop(documentElement) {
        const interval = setInterval(() => {
            if (documentElement.scrollTop === 0) {
                clearInterval(interval);
            } else {
                documentElement.scrollTop -= 50;
            }
        });
    }
};
const reviewsSwiper = {
    detectReviewsAndShowArrows() {
        const halfOfWindowHeight = (window.innerHeight || document.documentElement.clientHeight) / 2;
        const reviewsBoundingY = Math.round(document.querySelector('.reviews-container').getBoundingClientRect().y);
        const arrowsContainer = document.querySelector('.review-arrows-container');
        const isReviewsVisible = reviewsBoundingY >= -halfOfWindowHeight && reviewsBoundingY <= halfOfWindowHeight;

        if (isReviewsVisible) {
            arrowsContainer.classList.remove(zeroOpacityClass);
        } else {
            arrowsContainer.classList.add(zeroOpacityClass);
        }
    },

    hideCurrentAndShow(certainIdSelector) {
        const currentClientElements = this._getCurrentClientElements();
        const currentClient = currentClientElements.client;
        const currentChildElements = Array.from(currentClientElements.childElements);

        const certainClientElements = this._getCertainClientElements(certainIdSelector);
        const certainClient = certainClientElements.client;
        const certainChildElements = Array.from(certainClientElements.childElements);

        this._toggleReviewsArrowsAccess();
        this._toggleOpacityOfElements(currentChildElements);
        this._doThenableClientsDisappearing(currentClient, certainClient)
            .then(() => {
                this._toggleOpacityOfElements(certainChildElements);
                this._toggleReviewsArrowsAccess();
            });
    },

    _doThenableClientsDisappearing(currentClient, certainClient) {
        const opacityTransitionTime = 200;

        return new Promise((resolve) => {
            setTimeout(() => {
                certainClient.classList.toggle(displayNoneClass);

                setTimeout(() => {
                    currentClient.classList.toggle(displayNoneClass);
                    resolve();
                }, opacityTransitionTime);
            }, opacityTransitionTime);
        });
    },

    _toggleOpacityOfElements(elements) {
        for (const element of elements) {
            element.classList.toggle(zeroOpacityClass);
        }
    },

    _toggleReviewsArrowsAccess() { //* Prevents errors after multiple fast clicks on arrows
        const setOppositeAccessStatus = (element) => element.style.pointerEvents = !element.style.pointerEvents ? 'none' : '';
        const prevButton = document.querySelector('#prev');
        const nextButton = document.querySelector('#next');

        setOppositeAccessStatus(prevButton);
        setOppositeAccessStatus(nextButton);
    },

    _getCurrentClientElements() {
        const currentClient = document.querySelector('.reviews .client:not(.gone)');
        const currentChildElements = document.querySelectorAll(`#${currentClient.id} img, #${currentClient.id} p`);

        return {client: currentClient, childElements: currentChildElements};
    },

    _getCertainClientElements(idSelector) {
        const certainClient = document.querySelector(idSelector);
        const certainChildElements = document.querySelectorAll(`${idSelector} img, ${idSelector} p`);

        return {client: certainClient, childElements: certainChildElements};
    },

    getPrevClientIdSelector() {
        const lastClientIndex = this._getLastClientIndex();
        const currentClient = this._getCurrentClientElements().client;
        const currentClientIndex = this._getClientIndex(currentClient);
        const prevClientIndex = currentClientIndex === 1 ? lastClientIndex : currentClientIndex - 1;
        const prevClientIdSelector = '#client-' + prevClientIndex;

        return prevClientIdSelector;
    },

    getNextClientIdSelector() {
        const lastClientIndex = this._getLastClientIndex();
        const currentClient = this._getCurrentClientElements().client;
        const currentClientIndex = this._getClientIndex(currentClient);
        const nextClientIndex = currentClientIndex === lastClientIndex ? 1 : currentClientIndex + 1;
        const nextClientIdSelector = '#client-' + nextClientIndex;

        return nextClientIdSelector;
    },

    _getClientIndex(clientElement) {
        return +clientElement.id.split('-')[1];
    },

    _getLastClientIndex() {
        return Array.from(document.querySelectorAll('.reviews .client')).length;
    }
};
const windowsOpener = {
    openAddressOnMap() {
        const addressUrl = 'https://www.google.com/maps/place/Hahoma+12,+Rishon+LeTsiyon,+Israel';

        window.open(addressUrl, '_blank');
    }
};

/* ----------------------------- Event listeners ---------------------------- */
window.addEventListener('load', () => {
    setClientArrowsSwipe();
    setLogoContainerClick();
    setAddressButtonClick();
});

window.addEventListener('scroll', () => {
    const yScrollPosition = Math.ceil(window.scrollY);

    if (yScrollPosition === 0) {
        headerSqueezer.expandHeader();
    } else {
        headerSqueezer.squeezeHeader();
    }

    reviewsSwiper.detectReviewsAndShowArrows();
});

/* --------------------------- Listeners wrappers --------------------------- */
function setLogoContainerClick() {
    const logoContainer = document.querySelector('.logo-container');

    logoContainer.addEventListener('click', () => {
        scroller.scrollToTop();
    });
}

function setClientArrowsSwipe() {
    const prevArrow = document.querySelector('#prev');
    const nextArrow = document.querySelector('#next');

    prevArrow.addEventListener('click', () => {
        reviewsSwiper.hideCurrentAndShow(reviewsSwiper.getPrevClientIdSelector());
    });

    nextArrow.addEventListener('click', () => {
        reviewsSwiper.hideCurrentAndShow(reviewsSwiper.getNextClientIdSelector());
    });
}

function setAddressButtonClick() {
    const addressButton = document.querySelector('.address-button button');

    addressButton.addEventListener('click', () => {
        windowsOpener.openAddressOnMap();
    });
}