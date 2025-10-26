import { useState, useEffect, useRef } from "react";
import "./App.css";
import { CleanerSection } from "./components/CleanerSection/CleanerSection";
import { ChecklistSection } from "./components/ChecklistSection/ChecklistSection";
import { TasksFooter } from "./components/TasksFooter/TasksFooter";
import { Checklist } from "./types";
import GoogleAuth from "./components/GoogleLogin/GoogleLogin";
import UserInfo from "./components/UserInfo/UserInfo";
import { db } from "./firebase";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

const SECTION_ORDER = [
  "Bendra",
  "Virtuvė",
  "Tualetas",
  "Vonios kambarys",
  "Koridorius",
];

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
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const startDate = new Date("2025-10-26");
  const today = new Date();
  const diffWeeks = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 14),
  );
  const currentCleaner =
    flatmates[
      ((diffWeeks % flatmates.length) + flatmates.length - 1) % flatmates.length
    ];

  const checklistRef = doc(db, "checklists", "main");
  const cleanerRef = doc(db, "checklists", "metadata");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("auth_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(checklistRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Checklist;

        const orderedChecklist = Object.fromEntries(
          SECTION_ORDER.map((key) => [
            key,
            data[key] ?? INITIAL_CHECKLIST[key],
          ]),
        );

        setChecklist(orderedChecklist);
      } else {
        setDoc(checklistRef, INITIAL_CHECKLIST);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateCleaner = async () => {
      try {
        const metadataSnap = await getDoc(cleanerRef);
        const previousCleaner = metadataSnap.exists()
          ? metadataSnap.data().currentCleaner
          : null;

        // If cleaner changed, reset checklist
        if (previousCleaner !== currentCleaner) {
          await setDoc(checklistRef, INITIAL_CHECKLIST);
          await setDoc(cleanerRef, { currentCleaner });
        }
      } catch (err) {
        console.error("Error updating cleaner metadata:", err);
      }
    };

    updateCleaner();
  }, [currentCleaner]);

  const saveChecklist = (newChecklist: Checklist) => {
    setChecklist(newChecklist);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await setDoc(checklistRef, newChecklist);
    }, 500); // delay 0.5s after last change
  };

  const handleCheck = (category: string, item: string): void => {
    if (!user?.email?.toLowerCase().includes(currentCleaner.toLowerCase()))
      return;

    const newChecklist = {
      ...checklist,
      [category]: {
        ...checklist[category],
        items: {
          ...checklist[category].items,
          [item]: !checklist[category].items[item],
        },
      },
    };
    saveChecklist(newChecklist);
  };

  const toggleExpand = (category: string): void => {
    const newChecklist = {
      ...checklist,
      [category]: {
        ...checklist[category],
        expanded: !checklist[category].expanded,
      },
    };
    saveChecklist(newChecklist);
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
        <GoogleAuth
          onSuccess={(resp: any) => {
            setUser(resp);
            try {
              sessionStorage.setItem("auth_user", JSON.stringify(resp));
            } catch {}
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
    } catch {}
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
