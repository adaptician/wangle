import { WangleTemplatePage } from './app.po';

describe('Wangle App', function() {
  let page: WangleTemplatePage;

  beforeEach(() => {
    page = new WangleTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
