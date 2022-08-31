export const getCookie = (name: string) => {
    const cookieArray: Array<string> = document.cookie.split(';');
    const cookieName = `${name}=`;

    for (let cookie of cookieArray) {
        cookie = cookie.replace(/^\s+/g, '');
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return '';
};

