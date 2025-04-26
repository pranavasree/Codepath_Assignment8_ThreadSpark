import { useEffect, useState } from "react";
import { getUserPreferences, saveUserPreferences } from "../utils/Preferences";
import { supabase } from "../db/supabaseClient";

const SettingsPage = () => {
  const [preferences, setPreferences] = useState({
    theme: "light",
    show_content: true,
    show_images: true,
  });

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchPrefs = async () => {
      const { data } = await getUserPreferences(user_id);
      if (data) setPreferences(data);
    };
    fetchPrefs();
  }, [user_id]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newPrefs = {
      ...preferences,
      [name]: type === "checkbox" ? checked : value,
    };
    setPreferences(newPrefs);
    await saveUserPreferences(user_id, newPrefs);
  };

  return (
    <div className="settings">
      <h2>Interface Settings</h2>
      <label>
        Theme:
        <select name="theme" value={preferences.theme} onChange={handleChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          name="show_content"
          checked={preferences.show_content}
          onChange={handleChange}
        />
        Show Post Content
      </label>
      <label>
        <input
          type="checkbox"
          name="show_images"
          checked={preferences.show_image}
          onChange={handleChange}
        />
        Show Post Image
      </label>
    </div>
  );
};

export default SettingsPage;
