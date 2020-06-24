import { SmartModuleAngularPage } from './app.po';

describe('smart-module-angular App', () => {
  let page: SmartModuleAngularPage;

  beforeEach(() => {
    page = new SmartModuleAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
