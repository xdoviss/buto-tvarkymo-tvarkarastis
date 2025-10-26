import { useState, useEffect } from "react";
import "./App.css";
import { CleanerSection } from "./components/CleanerSection/CleanerSection";
import { ChecklistSection } from "./components/ChecklistSection/ChecklistSection";
import { TasksFooter } from "./components/TasksFooter/TasksFooter";
import { Checklist } from "./types";
import GoogleLogin from "./components/GoogleLogin/GoogleLogin";
import UserInfo from "./components/UserInfo/UserInfo";

const INITIAL_CHECKLIST: Checklist = {
  Bendra: {
    items: {
      "Išplaut grindis": false,
      "Apvalyt duris": false,
    },
    expanded: false,
  },
  Virtuvė: {
    items: {
      Stalviršis: false,
      "Arbatų lentyna": false,
      Gartraukis: false,
      "Siena virš kaitlentės": false,
      "Išplaut padėklus į kuriuos varva lėkštės": false,
      Palangė: false,
      "Langas (būtų gerai iš abiejų pusių)": false,
      "Indaplovė (filtras, purkštukai, šonai, patikrint ar netrūksta druskos ar skysčio)": false,
      "Spintelių durys": false,
      "Šiukšlių spintelė": false,
      Stalas: false,
      "Lentyna virš stalo": false,
      "Orkaitės vidus ir langas": false,
      "Mikrobangė ir jos lentyna": false,
      "Šaldytuvo durys, stogas": false,
      Kriauklė: false,
      "Išnešt šiukšles": false,
    },
    expanded: false,
  },
  Tualetas: {
    items: {
      Tualetas: false,
      Dangtis: false,
      "Išnešt šiukšles (jei reikia)": false,
      Paviršiai: false,
      "Sienos ir šiukšlių dėžė": false,
    },
    expanded: false,
  },
  "Vonios kambarys": {
    items: {
      Veidrodis: false,
      "Spintelės viršus": false,
      "Sienos nuo vandens/dantų pastos žymių": false,
      Kriauklė: false,
      "Dušas nuo kalkių": false,
      Vonia: false,
      "Jei reikia - panaudot granules (30 min.)": false,
      "Apatinė spintelė": false,
      "Išpurtyt ir išsiurbt kilimėlį": false,
      "Nuvalyt ir papildyt muilo dozatorių": false,
    },
    expanded: false,
  },
  Koridorius: {
    items: {
      "Nuvalyt veidrodį": false,
      "Nuvalyt suoliuko paviršių": false,
      "Aptvarkyti batus, kitus daiktus": false,
      "Išsiurbti kilimą": false,
    },
    expanded: false,
  },
};

const App: React.FC = () => {
  const flatmates = ["Guoda", "Dovydas", "Rokas"];
  const nextDeadline = new Date("2025-10-26T23:59:59");
  const [checklist, setChecklist] = useState<Checklist>(INITIAL_CHECKLIST);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("auth_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const startDate = new Date("2025-10-26");
  const today = new Date();
  const diffWeeks = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 14),
  );
  const currentCleaner =
    flatmates[
      ((diffWeeks % flatmates.length) + flatmates.length - 1) % flatmates.length
    ];

  const handleCheck = (category: string, item: string): void => {
    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: {
          ...prev[category].items,
          [item]: !prev[category].items[item],
        },
      },
    }));
  };

  const toggleExpand = (category: string): void => {
    setChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        expanded: !prev[category].expanded,
      },
    }));
  };

  const getRemainingTasks = (): { total: number; unchecked: number } => {
    let total = 0;
    let unchecked = 0;

    Object.values(checklist).forEach((category) => {
      Object.values(category.items).forEach((checked) => {
        total++;
        if (!checked) unchecked++;
      });
    });

    return { total, unchecked };
  };

  const { total, unchecked } = getRemainingTasks();

  if (!user) {
    return (
      <div
        className="container"
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1>Buto tvarkymo tvarkaraštis</h1>
        <GoogleLogin
          onSuccess={(resp: any) => {
            setUser(resp);
            try {
              sessionStorage.setItem("auth_user", JSON.stringify(resp));
            } catch (e) {}
          }}
          onError={(err: any) => {
            console.error("Google login error", err);
            alert("Nepavyko prisijungt su Google.");
          }}
        />
      </div>
    );
  }

  const handleLogout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem("auth_user");
    } catch (e) {}
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Buto tvarkymo tvarkaraštis</h1>
      </div>

      <UserInfo name={user?.name} onLogout={handleLogout} />

      <CleanerSection
        nextDeadline={nextDeadline}
        currentCleaner={currentCleaner}
      />

      <ChecklistSection
        checklist={checklist}
        onCheck={handleCheck}
        onToggleExpand={toggleExpand}
      />

      <TasksFooter total={total} unchecked={unchecked} />
    </div>
  );
};

export default App;
