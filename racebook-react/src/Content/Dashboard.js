import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { supabase } from '../supabaseClient';
import './Dashboard.css';
import RecordPartValuesForm from './RecordPartValuesForm';
import TrackMode from './TrackMode';


const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ session }) => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [parts, setParts] = useState([]);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('shop');

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    const savedCarId = localStorage.getItem('selectedCarId');
    if (savedCarId) {
      setSelectedCarId(savedCarId);
    }
  }, []);

  useEffect(() => {
    if (selectedCarId) {
      fetchParts(selectedCarId);
    }
  }, [selectedCarId]);

  useEffect(() => {
    setItems(generateItems());
  }, [cars, parts]);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching cars:', error);
    } else {
      console.log('Fetched cars:', data);
      setCars(data);
    }
  };

  const fetchParts = async (carId) => {
    console.log('Fetching parts for carId:', carId);
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .eq('car_id', carId);

    if (error) {
      console.error('Error fetching parts:', error);
    } else {
      console.log('Fetched parts:', data);
      setParts(data);
    }
  };

  const handleCarSelect = (event) => {
    const carId = event.target.value;
    console.log('Selected carId:', carId);
    setSelectedCarId(carId);
    localStorage.setItem('selectedCarId', carId);
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleViewParametersClick = (partId) => {
    navigate(`/view-parameters/${partId}`);
  };

  const generateItems = () => {
    const initialItems = [
      {
        i: 'a',
        x: 0,
        y: 0,
        w: 1,
        h: 5,
        static: false,
        content: (
          <div>
            <h2 className="grid-title">Selected Car</h2>
            {cars.length > 0 ? (
              <>
                <select onChange={handleCarSelect} value={selectedCarId || ''}>
                  <option value="" disabled>
                    Select a car
                  </option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name}
                    </option>
                  ))}
                </select>
                <button className="button primary block" onClick={() => handleButtonClick('/create-car')}>
                  Create a Car
                </button>
              </>
            ) : (
              <div>
                <p>No cars found! Create a car.</p>
                <button className="button primary block" onClick={() => handleButtonClick('/create-car')}>
                  Create a Car
                </button>
              </div>
            )}
            <div className="drag-handle">:::</div>
          </div>
        ),
      },
    ];

    if (selectedCarId) {
      initialItems.push({
        i: 'b',
        x: 0,
        y: 5,
        w: 1,
        h: 15,
        static: false,
        content: (
          <div>
            <h2 className="grid-title">Parts List</h2>
            <button className="button primary block" onClick={() => handleButtonClick(`/create-part/${selectedCarId}`)}>
              Create Part
            </button>
            {parts.length > 0 ? (
              <ul>
                {parts.map((part) => (
                  <li key={part.id} onClick={() => handleViewParametersClick(part.id)}>
                    {part.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No parts found for the selected car. Click the button above to create parts.</p>
            )}
            <div className="drag-handle">:::</div>
          </div>
        ),
      });

      initialItems.push({
        i: 'c',
        x: 3,
        y: 1,
        w: 2,
        h: 15,
        static: false,
        content: (
          <div>
            <RecordPartValuesForm carId={selectedCarId} session={session} />
            <div className="drag-handle">:::</div>
          </div>
        ),
      });
    }

    return initialItems;
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="tabs">
        <button className={`tab ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
          Shop Mode
        </button>
        <button className={`tab ${activeTab === 'track' ? 'active' : ''}`} onClick={() => setActiveTab('track')}>
          Track Mode
        </button>
      </div>
      {activeTab === 'shop' && (
        <ResponsiveGridLayout
          className="layout"
          onLayoutChange={() => {}}
          onBreakpointChange={() => {}}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
          autoSize={true}
          rowHeight={30}
          draggableHandle=".drag-handle"
        >
          {items.map((item) => (
            <div key={item.i} data-grid={item}>
              {item.content}
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
      {activeTab === 'track' && <TrackMode session={session} />}
    </div>
  );
};

export default Dashboard;
