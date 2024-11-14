import Parser from "rss-parser";

export class RssService {
  private _parser: Parser<any, any> = new Parser({
    customFields: {
      feed: ["foo", "baz"],
      item: ["bar"],
    },
  });

  public getFeed = async () => {
    const feed = await this._parser.parseURL("https://www.reddit.com/.rss");
    console.log(feed);
  };
}
