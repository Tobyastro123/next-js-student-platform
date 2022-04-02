import { useState } from 'react';

export default function Accordion(props) {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => {
    setIsShowing(!isShowing);
  };

  return (
    <div
      style={{
        width: '100%',
        marginBottom: '15px',
        lineHeight: '30px',
        border: '1px solid darkseagreen',
        borderRadius: '5px',
      }}
    >
      <button
        style={{
          width: '100%',
          position: 'relative',
          textAlign: 'left',
          padding: '8px',
          borderTop: '1px solid',
          background: '#d6eadf',
          outline: 'none',
          cursor: 'pointer',
        }}
        onClick={toggle}
        type="button"
      >
        <p>{props.title}</p>
      </button>
      <div
        style={{ display: isShowing ? 'block' : 'none', padding: '5px' }}
        dangerouslySetInnerHTML={{
          __html: props.content,
        }}
      />
    </div>
  );
}
