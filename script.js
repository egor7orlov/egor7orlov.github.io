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

        phoneNumber.classList.add('animate__fadeOutUp');
        getCallButton.classList.add('animate__fadeOutUp');
        phoneNumber.classList.remove('animate__fadeInDown');
        getCallButton.classList.remove('animate__fadeInDown');

        header.classList.remove('header-on-top');
        headSpacer.classList.remove('header-on-top');

        setTimeout(() => {
            logoContainer.classList.remove('logo-on-top');
        }, 300);
    },

    expandHeader() {
        const header = document.querySelector('.header');
        const headSpacer = document.querySelector('#head-spacer');
        const logoContainer = document.querySelector('.logo-container');
        const phoneNumber = document.querySelector('.header .sales p');
        const getCallButton = document.querySelector('.header .get-call button');
        logoContainer.style.cursor = 'default';

        phoneNumber.classList.add('animate__fadeInDown');
        getCallButton.classList.add('animate__fadeInDown');
        phoneNumber.classList.remove('animate__fadeOutUp');
        getCallButton.classList.remove('animate__fadeOutUp');
        header.classList.add('header-on-top');
        headSpacer.classList.add('header-on-top');

        setTimeout(() => {
            logoContainer.classList.add('logo-on-top');
        }, 300);
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
    hideCurrentAndShow(certainIdSelector) {
        const currentClientElements = this._getCurrentClientElements();
        const currentClient = currentClientElements.client;
        const currentChildElements = Array.from(currentClientElements.childElements);

        const certainClientElements = this._getCertainClientElements(certainIdSelector);
        const certainClient = certainClientElements.client;
        const certainChildElements = Array.from(certainClientElements.childElements);

        const reviewButtonContainer = document.querySelector('.review-button-container');

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
    },

    openFacebookPage() {
        const addressUrl = 'https://www.facebook.com/telepromtv/';

        window.open(addressUrl, '_blank');
    }
};
const listenersSetter = {
    setLogoContainerClick() {
        const logoContainer = document.querySelector('.logo-container');

        logoContainer.addEventListener('click', () => {
            scroller.scrollToTop();
        });
    },

    setClientArrowsSwipe() {
        const prevArrow = document.querySelector('#prev');
        const nextArrow = document.querySelector('#next');

        prevArrow.addEventListener('click', () => {
            reviewsSwiper.hideCurrentAndShow(reviewsSwiper.getPrevClientIdSelector());
        });

        nextArrow.addEventListener('click', () => {
            reviewsSwiper.hideCurrentAndShow(reviewsSwiper.getNextClientIdSelector());
        });
    },

    setAddressButtOnClick() {
        const addressButton = document.querySelector('.address-button-container button');

        addressButton.addEventListener('click', () => {
            windowsOpener.openAddressOnMap();
        });
    },

    setButtonsOpenRequestOnClick() {
        const buttons = document.querySelectorAll('button:not(.leave-review-button, .address-button, .close-icon)');
        const modalOverlay = document.querySelector('.modal-background');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                modalOverlay.classList.remove(displayNoneClass);
            });
        });
    },

    setCloseModalOnClick() {
        const closeIcon = document.querySelector('.close-icon');
        const modalOverlay = document.querySelector('.modal-background');

        closeIcon.addEventListener('click', () => {
            modalOverlay.classList.add(displayNoneClass);
        });
    },

    setLeaveReviewOnClick() {
        const leaveReviewButton = document.querySelector('.leave-review-button');

        leaveReviewButton.addEventListener('click', windowsOpener.openFacebookPage);
    },
};
const animator = {
    animateOnScroll() {
        this._animateAdvantages();
        this._animateMainAdvantage();
        this._animateOpportunities();
        this._animateSubscription();
        this._animateEconomy();
        this._animateClientStages();
        this._animateReviews();
        this._animateVideo();
        this._animateFooter();
    },

    /* ----------------------Sections' animations----------------------- */
    showTv() {
        const tv = document.querySelector('.tv');

        tv.classList.add('animate__fadeInUp');
    },

    _animateAdvantages() {
        const advantagesAmount = 8;

        if (this._isElementInViewport('.advantage')) {
            this._applyAnimation('#advantages-header', 'animate__fadeInDown');

            for (let i = 1; i <= advantagesAmount; i++) {
                const id = '#advantage-' + i;

                if (i % 2 !== 0) {
                    this._applyAnimation(id, 'animate__fadeInLeft');
                } else {
                    this._applyAnimation(id, 'animate__fadeInRight');
                }
            }
        }
    },

    _animateMainAdvantage() {
        if (this._isElementInViewport('.main-advantage .title')) {
            this._applyAnimation('.main-advantage .title', 'animate__fadeInLeft');
            this._applyAnimation('.main-advantage .text', 'animate__fadeInRight');
        }
    },

    _animateOpportunities() {
        if (this._isElementInViewport('.opportunities .opportunities-container')) {
            this._applyAnimation('.opportunities .title', 'animate__fadeInUp');

            const opportunities = Array.from(document.querySelectorAll('.opportunities .opportunity'));

            opportunities.forEach((opportunity) => {
                opportunity.classList.add('animate__flipInX');
                opportunity.classList.remove(zeroOpacityClass);
            });
        }
    },

    _animateSubscription() {
        if (this._isElementInViewport('.subscription.econom')) {
            this._applyAnimation('.subscription.econom', 'animate__fadeInUp');
            this._applyAnimation('.subscription.main', 'animate__fadeInDown');
        }
    },

    _animateEconomy() {
        if (this._isElementInViewport('.economy-list')) {
            const economyPoints = Array.from(document.querySelectorAll('.economy-point'));

            for (let i = 0; i < economyPoints.length; i++) {
                const economyPoint = economyPoints[i];

                setTimeout(() => {
                    economyPoint.classList.add('animate__fadeInBottomRight');
                    economyPoint.classList.remove(zeroOpacityClass);
                }, 200 * i);
            }
        }
    },

    _animateClientStages() {
        if (this._isElementInViewport('.stage-arrow')) {
            const arrows = Array.from(document.querySelectorAll('.stage-arrow'));

            for (let i = 0; i < arrows.length; i++) {
                const arrow = arrows[i];

                setTimeout(() => {
                    arrow.classList.add('animate__bounceIn');
                    arrow.classList.remove(zeroOpacityClass);
                }, 200 * i);
            }
        }
    },

    _animateReviews() {
        if (this._isElementInViewport('.reviews-container')) {
            this._applyAnimation('.reviews-container', 'animate__fadeInUp');
        }
    },

    _animateVideo() {
        if (this._isElementInViewport('.video')) {
            this._applyAnimation('.video', 'animate__fadeIn');
        }
    },

    _animateFooter() {
        if (this._isElementInViewport('.instructions')) {
            this._applyAnimation('.instructions', 'animate__fadeInLeft');
            this._applyAnimation('.support', 'animate__fadeInLeft');
            this._applyAnimation('.address-button-container', 'animate__fadeInRight');
        }
    },

    /* -------------------------Utility methods------------------------- */
    _isElementInViewport(selector) {
        const halfOfWindowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const reviewsBoundingY = Math.round(document.querySelector(selector).getBoundingClientRect().y);
        return reviewsBoundingY >= -halfOfWindowHeight && reviewsBoundingY <= halfOfWindowHeight;
    },

    _applyAnimation(toSelector, animationClass) {
        const elementToAnimate = document.querySelector(toSelector);

        elementToAnimate.classList.add(animationClass);
        elementToAnimate.classList.remove(zeroOpacityClass);
    }
};

/* ----------------------------- Event listeners ---------------------------- */
window.addEventListener('load', () => {
    listenersSetter.setClientArrowsSwipe();
    listenersSetter.setLogoContainerClick();
    listenersSetter.setAddressButtOnClick();
    listenersSetter.setCloseModalOnClick();
    listenersSetter.setButtonsOpenRequestOnClick();
    listenersSetter.setLeaveReviewOnClick();
    animator.showTv();
});

window.addEventListener('scroll', () => {
    const yScrollPosition = Math.ceil(window.scrollY);

    if (yScrollPosition === 0) {
        headerSqueezer.expandHeader();
    } else {
        headerSqueezer.squeezeHeader();
    }

    // reviewsSwiper.detectReviewsAndShowArrows();
    animator.animateOnScroll();
});
