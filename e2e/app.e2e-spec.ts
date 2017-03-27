import { SisbibfePage } from './app.po';

describe('sisbibfe App', function() {
  let page: SisbibfePage;

  beforeEach(() => {
    page = new SisbibfePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
