import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { href } from '../../stencil-router-v2';
import type { PageNavigation, TableOfContents } from '@stencil/ssg';
import Router from '../../router';
import state from '../../store';
import type { DocsTemplate } from '../../data.server/docs';

@Component({
  tag: 'docs-menu',
  styleUrl: 'docs-menu.scss',
  scoped: true,
})
export class SiteMenu implements ComponentInterface {
  version: string;

  @Prop() template: DocsTemplate;

  @Prop() toc: TableOfContents;
  @Prop() navigation: PageNavigation;

  @State() closeList = [];

  @State() showOverlay = false;

  @Event() menuToggled: EventEmitter;

  async componentWillLoad() {
    this.siteStructureListChange();

    // TODO pull this in from GitHub at build
    this.version = '2.3.0';
  }

  @Method()
  async toggleOverlayMenu() {
    this.showOverlay = !this.showOverlay;
  }

  @Watch('showOverlay')
  showOverlayChange() {
    this.menuToggled.emit(this.showOverlay);
  }

  @Watch('toc')
  // @Watch('url')
  siteStructureListChange() {
    // const parentIndex = this.toc.findIndex(
    //   item => item.url === this.url || (item.children && item.children.some(c => c.url === this.url)),
    // );
    // this.closeList = this.toc.map((_item, i) => i).filter(i => i !== parentIndex);
  }

  toggleParent = itemNumber => {
    return (e: MouseEvent) => {
      e.preventDefault();
      if (this.closeList.indexOf(itemNumber) !== -1) {
        this.closeList.splice(this.closeList.indexOf(itemNumber), 1);
        this.closeList = [...this.closeList];
      } else {
        this.closeList = [...this.closeList, itemNumber];
      }
    };
  };

  render() {
    const { template, version } = this;

    return (
      <Host
        class={{
          'menu-overlay-visible': this.showOverlay,
        }}
      >
        <div class="sticky">
          <div>
            <div class="menu-header">
              <app-menu-toggle icon="close" />
              <a {...href('/')} class="menu-header__logo-link">
                {state.pageTheme === 'dark' ? (
                  <img
                    src="/assets/img/heading/logo-white.png"
                    alt="Capacitor Logo"
                  />
                ) : (
                  <img
                    src="/assets/img/heading/logo-black.png"
                    alt="Capacitor Logo"
                  />
                )}
              </a>
              <a {...href('/docs')} class="menu-header__docs-link">
                docs
              </a>
              {version ? (
                <a
                  href={`https://github.com/ionic-team/capacitor/releases/tag/${version}`}
                  rel="noopener"
                  target="_blank"
                  class="menu-header__version-link"
                >
                  v{version}
                </a>
              ) : null}
            </div>
            <ul class="section-list">
              <li>
                <a {...href('/docs')} class={{ active: template === 'guide' }}>
                  Guides
                </a>
              </li>
              <li>
                <a
                  {...href('/docs/plugins')}
                  class={{ active: template === 'plugins' }}
                >
                  Plugins
                </a>
              </li>
              <li>
                <a
                  {...href('/docs/reference/cli')}
                  class={{ active: template === 'reference' }}
                >
                  CLI
                </a>
              </li>
            </ul>
            <ul class="menu-list">
              {this.toc?.root.map((item, i) => {
                const active = item.url === Router.activePath;
                const collapsed = this.closeList.indexOf(i) !== -1;

                if (item.children) {
                  return (
                    <li>
                      <a
                        href="#"
                        onClick={this.toggleParent(i)}
                        class={{ collapsed }}
                      >
                        {collapsed ? (
                          <ion-icon name="chevron-forward" />
                        ) : (
                          <ion-icon name="chevron-down" />
                        )}
                        <span class="section-label">{item.text}</span>
                      </a>
                      <ul class={{ collapsed }}>
                        {item.children.map(childItem => {
                          return (
                            <li>
                              {childItem.url ? (
                                <a
                                  {...href(childItem.url)}
                                  class={{
                                    'link-active':
                                      childItem.url === Router.activePath,
                                  }}
                                >
                                  {childItem.text}
                                </a>
                              ) : (
                                <a
                                  rel="noopener"
                                  class="link--external"
                                  target="_blank"
                                  href="#"
                                >
                                  {childItem.text}
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li>
                    {item.url ? (
                      <a
                        {...href(item.url)}
                        class={{
                          'section-active': active,
                        }}
                      >
                        <span class="section-active-indicator" />
                        <span class="section-label">{item.text}</span>
                      </a>
                    ) : (
                      <a
                        rel="noopener"
                        class="link--external"
                        target="_blank"
                        href="#"
                      >
                        {item.text}
                      </a>
                    )}
                  </li>
                );
              })}

              {template === 'guide' ? (
                <li class="docs-menu menu-footer">
                  <a {...href('/docs/apis')}>
                    <span class="section-label">Plugins</span>
                    <span class="arrow">-&gt;</span>
                  </a>
                </li>
              ) : (
                <li class="menu-footer">
                  <a {...href('/docs')}>
                    <span class="section-label">Guides</span>
                    <span class="arrow">-&gt;</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Host>
    );
  }
}
