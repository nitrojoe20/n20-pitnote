import React from 'react';
import { useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard() {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const layouts = {
    lg: [
      { i: 'a', x: 0, y: 0, w: 1, h: 3, minW: 2, static: false },
      { i: 'b', x: 1, y: 0, w: 1, h: 3, minW: 2, static: false },
      { i: 'c', x: 2, y: 0, w: 1, h: 3, minW: 2, static: false },
      { i: 'd', x: 0, y: 1, w: 1, h: 3, minW: 2, static: false }
    ]
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={30}
        draggableHandle=".drag-handle"
      >
        <div key="a" className="grid-item">
          <button className="button primary block" onClick={() => handleButtonClick('/create-car')}>Create a Car</button>
          <div className="drag-handle">:::</div>
        </div>
        <div key="b" className="grid-item">
          <button className="button primary block">Selected Car</button>
          <div className="drag-handle">:::</div>
        </div>
        <div key="c" className="grid-item">
          <button className="button primary block">Create a Session</button>
          <div className="drag-handle">:::</div>
        </div>
        <div key="d" className="grid-item">
          <button className="button primary block">Modify Current Setup</button>
          <div className="drag-handle">:::</div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

export default Dashboard;
