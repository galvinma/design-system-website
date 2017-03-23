import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PageHeader from '../../internal/PageHeader';
import ImageGrid from '../../internal/ImageGrid';
import ColorContrast from '../../internal/ColorContrast';
import GridExample from '../../internal/GridExample';
import LayerTypes from '../../internal/LayerTypes';
import LayerUsage from '../../internal/LayerUsage';
import TypographyTable from '../../internal/TypographyTable';
import BrandColors from '../../internal/BrandColors';
import MotionExample from '../../internal/MotionExample';
import MarkdownPage from '../../internal/MarkdownPage';

class Page extends Component {
  static propTypes = {
    content: PropTypes.any,
    label: PropTypes.string,
    title: PropTypes.string,
  }

  componentDidMount() {
    this.updateClasses();
    this.addCustomComponent();
    this.colorHex();
  }

  componentDidUpdate() {
    this.updateClasses();
    this.addCustomComponent();
    this.colorHex();
  }

  addPageClass = () => {
    const path = window.location.pathname.split('/');
    const dataAttr = (path.length > 3) ? `${path[1]}-${path[3]}-${path[2]}` : `${path[1]}-${path[2]}`;
    return dataAttr;
  }

  colorHex = () => {
    const tableCells = document.querySelectorAll('td');
    const colors = [...tableCells].filter((color) => {
      let node;
      if (color.textContent.includes('#')) {
        node = color;
      }
      return node;
    });

    [...colors].forEach((color) => {
      const colorBlock = document.createElement('span');
      colorBlock.classList.add('color-block');

      if (color.textContent.length > 7 && color.textContent.length < 20) {
        colorBlock.style.left = '7rem';
      } else if (color.textContent.length > 7) {
        colorBlock.style.left = '10rem';
      }

      if (color.textContent === '#3d70b2 @ 10%') {
        colorBlock.style.backgroundColor = '#E5EAF7';
        colorBlock.style.border = '1px solid #8c9ba5';
      } else {
        colorBlock.style.backgroundColor = color.textContent;
      }

      if (color.textContent === '#ffffff' ||
          color.textContent === '#f5f7fa' ||
          color.textContent === '#f0f3f6') {
        colorBlock.style.border = '1px solid #8c9ba5';
      }

      color.appendChild(colorBlock);
    });
  }

  addCustomComponent = () => {
    const customComponents = {
      ImageGrid,
      ColorContrast,
      GridExample,
      LayerTypes,
      LayerUsage,
      TypographyTable,
      MotionExample,
      BrandColors
    };

    const insertComponent = [... document.querySelectorAll('[data-insert-component]')];
    insertComponent.forEach(component => {
      const comp = component.dataset.insertComponent;
      const NewComponent = customComponents[comp];
      if (comp === 'ImageGrid') {
        let needsDarkBg;
        if (component.dataset.darkBg) {
          needsDarkBg = component.dataset.darkBg.split(',');
        } else {
          needsDarkBg = [];
        }
        const compChildren = component.innerHTML;
        component.classList.add('custom-component-parent');
        ReactDOM.render(
          <NewComponent darkBg={needsDarkBg}>
            {compChildren}
          </NewComponent>,
          component
        );
      } else {
        ReactDOM.render(
          <NewComponent />,
          component
        );
      }
    });
  }

  updateClasses = () => {
    // Make link buttons
    const linkButtons = [... document.querySelectorAll('hr')];
    if (linkButtons) {
      linkButtons.forEach(sibling => {
        if (sibling.nextElementSibling.tagName === 'P') {
          if (sibling.nextElementSibling.querySelector('a')) {
            sibling.nextElementSibling.querySelector('a').classList.add('bx--btn', 'bx--btn--secondary');
          }
        }
      });
    }
  }

  render() {
    const {
      content,
      label,
      title,
    } = this.props;
    const contentType = typeof content;
    const pageContent = (contentType === 'object' || title === '') ?
      content : <MarkdownPage content={content} />;
    return (
      <div data-page={this.addPageClass()}>
        <PageHeader
          label={label}
          title={title}
        />
        {pageContent}
      </div>
    );
  }
}

export default Page;
