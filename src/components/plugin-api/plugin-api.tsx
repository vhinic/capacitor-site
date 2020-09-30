import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'plugin-api',
  styleUrl: 'plugin-api.scss',
})
export class PluginApi {
  // @Element() el: Element;
  @Prop() name: string;
  @Prop() index = false;
  @Prop() api: string;
  content: string;

  // componentDidUpdate() {
  //   this.bindHeadings(this.el);
  // }

  // bindHeadings(el: Element) {
  //   if (Build.isServer) {
  //     return;
  //   }

  //   const headings = Array.from(el.querySelectorAll('h1,h2,h3,h4,h5'));
  //   headings.forEach(h => {
  //     h.classList.add('anchor-link-relative');
  //     var link = document.createElement('anchor-link');
  //     link.className = 'hover-anchor';
  //     if (h.id) {
  //       link.to = h.id;
  //     }
  //     link.innerHTML = '#';
  //     h.insertBefore(link, h.firstChild);
  //   });
  // }

  render() {
    if (!this.api || this.api === 'undefined') {
      return null;
    }
    // global.console.log(this.api)
    // debugger;
    const data = JSON.parse(this.api);

    return (
      <Host>
        <div>plugin api: {this.name}</div>
        <div>data: {JSON.stringify(data)}</div>
      </Host>
    );
  }
}
