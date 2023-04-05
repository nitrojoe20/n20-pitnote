import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import GridLayout from "react-grid-layout"
import { Sidebar } from './Sidebar'

export function ScreenHome() {
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    const getLayout = async () => {
      console.log("Getting layout for user", supabase.auth.user().id);
      const { data: layoutData, error } = await supabase
        .from("layouts")
        .select("*")
        .eq("profile_id", supabase.auth.user().id)
        .single();
      if (layoutData) {
        console.log("Layout data found:", layoutData);
        setLayout(layoutData);
      } else if (error) {
        console.error("Error fetching layout:", error.message);
      } else {
        console.log("No layout data found, creating default layout...");
        // If there's no layout data for the user, create a default layout
        const { error } = await supabase
          .from("layouts")
          .insert({ profile_id: supabase.auth.user().id, layout: [] });
        if (error) {
          console.error("Error creating default layout:", error.message);
        } else {
          setLayout({ profile_id: supabase.auth.user().id, layout: [] });
        }
      }
      setLoading(false);
    };
    getLayout();
  }, []);
  const onLayoutChange = async (newLayout) => {
    const { error } = await supabase
      .from("layouts")
      .upsert(
        { profile_id: supabase.auth.user().id, profile_id: supabase.auth.user().id, layout: newLayout },
        { onConflict: "profile_id", filter: { profile_id: supabase.auth.user().id } }
      );
    if (error) {
      console.error("Error saving layout:", error.message);
    } else {
      console.log("Layout saved:", { profile_id: supabase.auth.user().id, layout: newLayout });
    }
  };


  const handleSignOut = async (e) => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <Sidebar />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="homepage">
          {layout ? (
            <>
              <h2>{layout.name}</h2>
              <GridLayout
                className="layout"
                layout={layout.layout}
                cols={12}
                rowHeight={30}
                width={1200}
                onLayoutChange={onLayoutChange}
              >
                <div key="1">Component 1</div>
                <div key="2">Component 2</div>
                <div key="3">Component 3</div>
              </GridLayout>
            </>
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
      )}
      <div className="row flex flex-center">
        <div className="col-6 form-widget" aria-live="polite">
          <h1 className="header">RaceBook Home</h1>
          <p className="description">Home</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    </>
  );
}