import {OrList} from "./Utils";
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
import {log} from "./Logger";

export enum CaseState {

}

export interface DataCase {
  id:string
  code:string
  deps:OrList<string>
  url:OrList<string>
  pattern:OrList<RegExp>
  glob:OrList<string>
  enabled:boolean
}

const OTHER_BOOKMARKS_ROOT_ID = "2"
const BOOKMARK_ROOT_NAME = "ExtraJS Data"

export default class Data {

  root:BookmarkTreeNode

  constructor() {
    this.getRoot(() => {

    })
  }

  buildFilter

  getCode(url, cb) {
    if (!this.root)
      return {}
    let list = this.root.children.filter(node => {
      
    })
  }

  add(data:Partial<DataCase>) {

  }

  private loadPatterns

  private getRoot(cb:Function) {
    chrome.bookmarks.getSubTree(OTHER_BOOKMARKS_ROOT_ID,list => {
      for (let i = 0; i < list[0].children.length; i++) {
        let node = list[0].children[i];
        if (node.title === BOOKMARK_ROOT_NAME) {
          this.root = node
          cb && cb()
          return
        }
      }
      chrome.bookmarks.create({
        parentId: OTHER_BOOKMARKS_ROOT_ID,
        title: BOOKMARK_ROOT_NAME
      }, res => {
        this.root = res
        cb && cb()
        return
      })
    })
  }


}
