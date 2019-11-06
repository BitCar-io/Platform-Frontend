export default class HomepageLink {

    type:string;
    title:string;
    url:string;

    constructor(type:string, title:string, url:string) {
        this.type = type;
        this.title = title;
        this.url = url;
    }
}