import React, { useEffect, useState } from "react";
import api from "./api";
import { CommandDetail } from "./components/CommandDetail";
import { CommandList } from "./components/CommandList";
import { ExecutionLogs } from "./components/ExecutionLogs";
import { Layout } from "./components/Layout";
import { Command } from "./types";

export const App: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedName, setSelectedName] = useState<string | undefined>();
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [activeExecutionId, setActiveExecutionId] = useState<number | null>(null);

  useEffect(() => {
    api.get<Command[]>("commands/").then((res) => {
      setCommands(res.data);
      if (res.data.length && !selectedName) {
        const first = res.data[0].name;
        setSelectedName(first);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedName) {
      setSelectedCommand(null);
      return;
    }
    api.get<Command>(`commands/${selectedName}/`).then((res) => setSelectedCommand(res.data));
  }, [selectedName]);

  return (
    <Layout>
      <CommandList
        commands={commands}
        selectedName={selectedName}
        onSelect={(name) => {
          setSelectedName(name);
          setActiveExecutionId(null);
        }}
      />
      <CommandDetail
        command={selectedCommand}
        onExecutionStarted={(id) => {
          setActiveExecutionId(id);
        }}
      />
      <ExecutionLogs executionId={activeExecutionId} />
    </Layout>
  );
};
