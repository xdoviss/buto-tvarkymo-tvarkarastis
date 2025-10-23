import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const flatmates = ["Guoda", "Dovydas", "Rokas"];
  const nextDeadline = new Date("2025-10-26T23:59:59");
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(nextDeadline));

  const startDate = new Date("2025-10-26");
  const today = new Date();
  const diffWeeks = Math.floor(
    (today - startDate) / (1000 * 60 * 60 * 24 * 14)
  );
  const currentCleaner =
    flatmates[((diffWeeks % flatmates.length) + flatmates.length) % flatmates.length];

  const [checklist, setChecklist] = useState({
    "Bendra": {
      items: {
      "Išplaut grindis": false,
      "Apvalyt duris": false,
      },
      expanded: false,
    },
    "Virtuvė": {
      items: {
        "Stalviršis": false,
        "Arbatų lentyna": false,
        "Gartraukis": false,
        "Siena virš kaitlentės": false,
        "Išplaut padėklus į kuriuos varva lėkštės": false,
        "Palangė": false,
        "Langas (būtų gerai iš abiejų pusių)": false,
        "Indaplovė (filtras, purkštukai, šonai, patikrint ar netrūksta druskos ar skysčio)": false,
        "Spintelių durys": false,
        "Šiukšlių spintelė": false,
        "Stalas": false,
        "Lentyna virš stalo": false,
        "Orkaitės vidus ir langas": false,
        "Mikrobangė ir jos lentyna": false,
        "Šaldytuvo durys, stogas": false,
        "Kriauklė": false,
        "Išnešt šiukšles": false,
      },
      expanded: false
    },
    "Tualetas": {
      items: {
        "Tualetas": false,
        "Dangtis": false,
        "Išnešt šiukšles (jei reikia)": false,
        "Paviršiai": false,
        "Sienos ir šiukšlių dėžė": false,
      },
      expanded: false
    },
    "Vonios kambarys": {
      items: {
        "Veidrodis": false,
        "Spintelės viršus": false,
        "Sienos nuo vandens/dantų pastos žymių": false,
        "Kriauklė": false,
        "Dušas nuo kalkių": false,
        "Vonia": false,
        "Jei reikia - panaudot granules (30 min.)": false,
        "Apatinė spintelė": false,
        "Išpurtyt ir išsiurbt kilimėlį": false,
        "Nuvalyt ir papildyt muilo dozatorių": false,
      },
      expanded: false
    },
    "Koridorius": {
      items: {
        "Nuvalyt veidrodį": false,
        "Nuvalyt suoliuko paviršių": false,
        "Aptvarkyti batus, kitus daiktus": false,
        "Išsiurbti kilimą": false
      },
      expanded: false
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(nextDeadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [nextDeadline]);

  function getTimeRemaining(deadline) {
    const total = deadline - new Date();
    if (total <= 0) {
      return { weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    return { weeks, days: days % 7, hours, minutes, seconds };
  }

  const handleCheck = (category, item) => {
    setChecklist(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: {
          ...prev[category].items,
          [item]: !prev[category].items[item]
        }
      }
    }));
  };

  const toggleExpand = (category) => {
    setChecklist(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        expanded: !prev[category].expanded
      }
    }));
  };

  const getRemainingTasks = () => {
    let total = 0;
    let unchecked = 0;
    
    Object.values(checklist).forEach(category => {
      Object.values(category.items).forEach(checked => {
        total++;
        if (!checked) unchecked++;
      });
    });
    
    return { total, unchecked };
  };

  const { total, unchecked } = getRemainingTasks();

  return (
    <div className="container">
      <h1>Buto tvarkymo tvarkaraštis</h1>

      <section className="cleaner-section">
        <p>
          <strong>Tvarkymo terminas:</strong>{" "}
          {nextDeadline.toLocaleDateString()}
        </p>
        <div className="cleaner-box">
          <p>Sekantis tvarko:</p>
          <h2>{currentCleaner}</h2>
        </div>
        <div className="countdown">
          <p>
            ⏳ Likęs laikas:{" "}
            <span>
              {timeLeft.weeks > 0 && `${timeLeft.weeks} sav `}
              {timeLeft.days > 0 && `${timeLeft.days} d `}
              {timeLeft.hours > 0 && `${timeLeft.hours} h `}
              {timeLeft.minutes > 0 && `${timeLeft.minutes} m `}
              {timeLeft.seconds > 0 && `${timeLeft.seconds} s`}
            </span>
          </p>
        </div>
      </section>

      <section className="checklist-section">
        <h3>Tvarkymo sąrašas</h3>
        <ul className="categories-list">
          {Object.entries(checklist).map(([category, { items, expanded }]) => (
            <li key={category} className="category-item">
              <div className="category-header" onClick={() => toggleExpand(category)}>
                <span style={{ textTransform: "capitalize" }}>{category}</span>
                <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
              </div>
              {expanded && (
                <ul className="items-list">
                  {Object.entries(items).map(([item, checked]) => (
                    <li key={item}>
                      <label>
                        <span>{item}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCheck(category, item)}
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>
      
      <footer className="tasks-footer">
        {unchecked === 0 ? (
          <p>🎉 Namai tvarkingi, yippie!</p>
        ) : (
          <p>📝 Liko sutvarkyti {unchecked}/{total}</p>
        )}
      </footer>
    </div>
  );
}
