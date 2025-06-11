export class CookieUtil {
  static set(
    name: string,
    value: string,
    options: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
    } = {}
  ): void {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      if (typeof options.expires === "number") {
        const seconds = options.expires;
        //const days = options.expires;
        // const date = new Date();
        // date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        // options.expires = date;
        const date = new Date();
        date.setTime(date.getTime() + seconds * 1000); // 将天数改为秒数
        options.expires = date;
      }
      cookie += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.path) {
      cookie += `; path=${options.path}`;
    }

    if (options.domain) {
      cookie += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookie += "; secure";
    }

    if (options.sameSite) {
      cookie += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookie;
  }

  static get(name: string): string | null {
    const cookies = document.cookie.split(";");
    const cookieName = encodeURIComponent(name);

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(cookieName + "=") === 0) {
        return decodeURIComponent(
          cookie.substring(cookieName.length + 1, cookie.length)
        );
      }
    }
    return null;
  }
  static remove(
    name: string,
    options: { path?: string; domain?: string } = {}
  ): void {
    const opts = {
      ...options,
      expires: new Date(0),
    };
    this.set(name, "", opts);
  }
  static exists(name: string): boolean {
    return this.get(name) !== null;
  }
}
