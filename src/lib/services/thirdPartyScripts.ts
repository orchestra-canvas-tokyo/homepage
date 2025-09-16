import { thirdPartyScripts } from '../config/thirdPartyScripts';

const gtagId = thirdPartyScripts.gtag.id;
const clarityId = thirdPartyScripts.clarity.id;

const gtagScriptId = 'gtag-script';
const gtagConfigScriptId = 'gtag-config-script';
const clarityScriptId = 'clarity-script';

export const injectThirdPartyScripts = () => {
	if (document.getElementById(gtagScriptId)) return;

	const gtagScript = document.createElement('script');
	gtagScript.id = gtagScriptId;
	gtagScript.async = true;
	gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
	document.head.appendChild(gtagScript);

	const gtagConfigScript = document.createElement('script');
	gtagConfigScript.id = gtagConfigScriptId;
	gtagConfigScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gtagId}');
  `;
	document.head.appendChild(gtagConfigScript);

	const clarityScript = document.createElement('script');
	clarityScript.id = clarityScriptId;
	clarityScript.innerHTML = `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");
  `;
	document.head.appendChild(clarityScript);
};

export const removeThirdPartyScripts = () => {
	const gtagScript = document.getElementById(gtagScriptId);
	const gtagConfigScript = document.getElementById(gtagConfigScriptId);
	const clarityScript = document.getElementById(clarityScriptId);

	if (gtagScript) document.head.removeChild(gtagScript);
	if (gtagConfigScript) document.head.removeChild(gtagConfigScript);
	if (clarityScript) document.head.removeChild(clarityScript);
};
