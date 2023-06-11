export function save_cookie(name, value) {
    document.cookie = "name=" + name + "; value=" + value + "; path=/";
}

export default save_cookie;