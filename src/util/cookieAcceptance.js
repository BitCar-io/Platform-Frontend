import cookieconsent from 'cookieconsent';

import { URL_PRIVACY_POLICY } from "./platformNavigation";

const getCurrentPolicyUrl = (currentHref) => {

  if(!currentHref) {
    return 'https://bitcar.io';
  }

  const baseUrl = currentHref.split('#')[0];

  return `${baseUrl}#${URL_PRIVACY_POLICY}`;
}

// window.cookieconsent = cookieconsent;
// https://cookieconsent.insites.com/documentation/javascript-api/
const cookieAcceptance = async () => {
  return new Promise((resolve, reject) => {
  window.addEventListener('load', function(dispatch) {
    window.cookieconsent.initialise({
          theme: "classic",
        //   position: "bottom-right",
          position: "bottom",
          static: true,
          type: "opt-in",
          content: {
            message: "The BITCAR platform uses cookies to to help us bring you the best experience possible.\nWe DO NOT store or collect any personally identifiable information or wallet data in these cookies.",
            allow: "I'm happy with this",
            policy: "Review Cookie Policy",
            deny: "Decline",
            href: getCurrentPolicyUrl(window.location ? window.location.href : null),
            target: '_blank'
          },
          revokeBtn: '<div style="display: none;"></div>'
      })});
    });
}

export default cookieAcceptance;
