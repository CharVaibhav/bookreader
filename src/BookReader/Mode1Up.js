// @ts-check
import { Mode1UpLit } from './Mode1UpLit.js';
/** @typedef {import('../BookReader.js').default} BookReader */
/** @typedef {import('./BookModel.js').BookModel} BookModel */
/** @typedef {import('./BookModel.js').PageIndex} PageIndex */

export class Mode1Up {
  /**
   * @param {BookReader} br
   * @param {BookModel} bookModel
   */
  constructor(br, bookModel) {
    this.br = br;
    this.book = bookModel;
    this.mode1UpLit = new Mode1UpLit(bookModel, br);

    /** @private */
    this.$el = $(this.mode1UpLit).addClass('br-mode-1up BRmode1up');

    this.everShown = false;
  }

  // TODO: Might not need this anymore? Might want to delete.
  /** @private */
  get $brContainer() { return this.br.refs.$brContainer; }

  /**
   * This is called when we switch to one page view
   */
  prepare() {
    const startLeaf = this.br.currentIndex();
    this.$brContainer
      .empty()
      .css({ overflow: 'hidden' })
      .append(this.$el);

    setTimeout(() => {
      if (!this.everShown) {
        this.mode1UpLit.initFirstRender(startLeaf);
        this.everShown = true;
      }
      this.mode1UpLit.jumpToIndex(startLeaf);
    });
    this.br.updateBrClasses();
  }

  /**
   * BREAKING CHANGE: No longer supports pageX/pageY
   * @param {PageIndex} index
   * @param {number} [pageX] x position on the page (in pixels) to center on
   * @param {number} [pageY] y position on the page (in pixels) to center on
   * @param {boolean} [noAnimate]
   */
  jumpToIndex(index, pageX, pageY, noAnimate) {
    // Only smooth for small distances
    const distance = Math.abs(this.br.currentIndex() - index);
    const smooth = !noAnimate && distance <= 4;
    this.mode1UpLit.jumpToIndex(index, { smooth });
  }

  /**
   * @param {'in' | 'out'} direction
   */
  zoom(direction) {
    if (direction == 'in') this.mode1UpLit.zoomIn();
    else this.mode1UpLit.zoomOut();
  }

  /**
   * Resize the current one page view
   * Note this calls drawLeafs
   */
  resizePageView() {
    this.mode1UpLit.htmlDimensionsCacher.updateClientSizes();
    this.mode1UpLit.requestUpdate();
  }
}
