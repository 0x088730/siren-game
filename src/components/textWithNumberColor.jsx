import React from 'react';

export class TextWithNumberColor extends React.Component {
  render() {
    const text = this.props.text;
    const words = text.split(/\s+/); // Split text into words

    return (
      <div>
        {words.map((word, index) => {
          // Check if the word contains a number
          const containsNumber = /\d/.test(word);

          // Apply different color based on the presence of a number
          const style = {
            color: containsNumber ? '#FF9900' : '#FFFFFF',
            textShadow: containsNumber ? null : "1px 1px 2px black"
          };

          return (
            <span key={index} style={style}>
              {word}{' '}
            </span>
          );
        })}
      </div>
    );
  }
}