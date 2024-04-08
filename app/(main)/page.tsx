"use client";

import { Welcome } from "../../components/Welcome/Welcome";
import { ColorSchemeToggle } from "../../components/ColorSchemeToggle/ColorSchemeToggle";
import {
  Button,
  Checkbox,
  Collapse,
  Container,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect, use } from "react";
import { UserCard } from "@/components/userCard";
import { useForm } from "@mantine/form";

export default function HomePage() {
  const [colorSchemeOpened, { toggle: toggleColorScheme }] =
    useDisclosure(true);
  const [editUsersOpened, { toggle: toggleEditUsers }] = useDisclosure(true);

  const [
    addMemberModalOpened,
    { open: openAddMemberModal, close: closeAddMemberModal },
  ] = useDisclosure(false);
  const addMemberForm = useForm({
    initialValues: {
      name: "",
      id: "",
    },
  });

  const [
    removeMemberModalOpened,
    { open: openRemoveMemberModal, close: closeRemoveMemberModal },
  ] = useDisclosure(false);
  const [deleteMemberValue, setDeleteMemberValue] = useState<string | null>("");

  const [
    editMemberModalOpened,
    { open: openEditMemberModal, close: closeEditMemberModal },
  ] = useDisclosure(false);
  const [editMemberValue, seteditMemberValue] = useState<string | null>("");
  const editMemberForm = useForm({
    initialValues: {
      nameChange: "",
      fishParticipation: false,
      donations: 0,
    },
  });

  const [
    fishiErgebnisseMdalOpened,
    { open: openFishiErgebnisseMdal, close: closeFishiErgebnisseMdal },
  ] = useDisclosure(false);
  const [fishiTeilnehmer, setFishiTelnehmer] = useState<string[]>([]);

  const [
    bulkAddDonationsmodalOpened,
    { open: openBulkAddDonationsModal, close: closeBulkAddDonationsModal },
  ] = useDisclosure(false);
  const [bulkDonationUsers, setBulkDonationUsers] = useState<string[]>([]);
  const [bulkDonationValue, setBulkDonationValue] = useState<string | number>(
    0
  );

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch("api/getUsers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();
      const users = data.data;
      console.log(users);
      setUsers(users);
    };

    getUsers();
  }, []);

  return (
    <>
      <Modal
        opened={addMemberModalOpened}
        onClose={closeAddMemberModal}
        title="Mitglied hizufügen"
      >
        <Container>
          <TextInput
            {...addMemberForm.getInputProps("name")}
            label="Name"
            placeholder="Name"
          />
          <TextInput
            {...addMemberForm.getInputProps("id")}
            label="ID"
            placeholder="ID"
          />
        </Container>
        <Button
          onClick={async () => {
            const respo = await fetch("/api/addUser", {
              method: "POST",
              body: JSON.stringify(addMemberForm.values),
            });
            console.log(respo);
            const respoData = await respo.json();
            console.log(respoData);
            //reload window
            // window.location.reload()
          }}
        >
          Hinzufügen
        </Button>
      </Modal>

      <Modal
        opened={removeMemberModalOpened}
        onClose={closeRemoveMemberModal}
        title="Mitglied entfernen"
      >
        <Select
          label="Nutzer auswählen"
          placeholder="Nutzer auswählen"
          data={users.map((user: any) => {
            return user.name + " (" + user.id + ")";
          })}
          searchable
          value={deleteMemberValue}
          onChange={setDeleteMemberValue}
        />
        <Button
          onClick={() => {
            fetch("/api/removeUser", {
              method: "POST",
              body: JSON.stringify({
                id: deleteMemberValue?.split("(")[1].split(")")[0],
              }),
            });
            //reload window
            window.location.reload();
          }}
        >
          Entfernen
        </Button>
      </Modal>

      <Modal
        opened={editMemberModalOpened}
        onClose={closeEditMemberModal}
        title="Mitglied bearbeiten"
      >
        <Select
          label="Nutzer auswählen"
          placeholder="Nutzer auswählen"
          data={users.map((user: any) => {
            return user.name + " (" + user.id + ")";
          })}
          searchable
          value={editMemberValue}
          onChange={seteditMemberValue}
        />

        <Container>
          <TextInput
            {...editMemberForm.getInputProps("nameChange")}
            label="Name"
            placeholder="Name"
          />
          <NumberInput
            {...editMemberForm.getInputProps("donations")}
            label="Spenden"
            placeholder="Spenden"
          />
          <Checkbox
            {...editMemberForm.getInputProps("fishParticipation")}
            label="Fischteilnahme"
            placeholder="Fischteilnahme"
          />
        </Container>

        <Button
          onClick={() => {
            fetch("/api/editUser", {
              method: "POST",
              body: JSON.stringify({
                id: editMemberValue?.split("(")[1].split(")")[0],
                ...editMemberForm.values,
              }),
            });

            //reload window
            window.location.reload();
          }}
        >
          Bearbeiten
        </Button>
      </Modal>

      <Modal
        opened={fishiErgebnisseMdalOpened}
        onClose={closeFishiErgebnisseMdal}
        title="Fischikampf ergebnisse"
      >
        <MultiSelect
          data={users.map((user: any) => {
            return user.name + " (" + user.id + ")";
          })}
          value={fishiTeilnehmer}
          onChange={setFishiTelnehmer}
        />
        ;
        <Button
          onClick={() => {
            fishiTeilnehmer.map((user) => {
              fetch("/api/editUser", {
                method: "POST",
                body: JSON.stringify({
                  id: user.split("(")[1].split(")")[0],
                  fishParticipation: true,
                }),
              });
            });
            //reload window
            window.location.reload();
          }}
          mt={"lg"}
        >
          Ergebnisse eintragen
        </Button>
      </Modal>

      <Modal
        opened={bulkAddDonationsmodalOpened}
        onClose={closeBulkAddDonationsModal}
        title="Bulk Spenden hinzufügen"
      >
        <MultiSelect
          data={users.map((user: any) => {
            return user.name + " (" + user.id + ")";
          })}
          value={bulkDonationUsers}
          onChange={setBulkDonationUsers}
        />
        <NumberInput
          value={bulkDonationValue}
          onChange={setBulkDonationValue}
          label="Spenden"
          placeholder="Spenden"
          min={0}
          max={500}
          step={100}
        />
        <Button
          onClick={() => {
            bulkDonationUsers.map((user) => {
              fetch("/api/editUser", {
                method: "POST",
                body: JSON.stringify({
                  id: user.split("(")[1].split(")")[0],
                  donations: 100,
                }),
              });
            });
            //reload window
            window.location.reload();
          }}
          mt={"lg"}
        >
          Spenden hinzufügen
        </Button>
      </Modal>

      <Welcome />
      <Text
        c="dimmed"
        ta="center"
        size="lg"
        maw={580}
        mx="auto"
        mt="xl"
        onClick={toggleColorScheme}
        style={{ cursor: "pointer" }}
      >
        Farbschema ändern
      </Text>
      <Collapse in={colorSchemeOpened}>
        <ColorSchemeToggle />
      </Collapse>
      <Text
        c="dimmed"
        ta="center"
        size="lg"
        maw={580}
        mx="auto"
        mt="xl"
        onClick={toggleEditUsers}
        style={{ cursor: "pointer" }}
      >
        Clanmitglieder einsehen
      </Text>
      <Collapse in={editUsersOpened}>
        <SimpleGrid cols={3} w={"750"} mx={"auto"}>
          {users.map((user, index) => {
            return <UserCard key={index} data={user} />;
          })}
        </SimpleGrid>
      </Collapse>
      <SimpleGrid cols={{ base: 1, lg: 3 }} max-w={"750"} mx="auto" mt={20}>
        <Button p={0} onClick={openAddMemberModal}>
          Mitglied hinzufügen
        </Button>
        <Button p={0} onClick={openRemoveMemberModal}>
          Mitglied entefernen
        </Button>
        <Button p={0} onClick={openEditMemberModal}>
          Mitgliederdaten hinzufügen
        </Button>
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, lg: 2 }} max-w={"750"} mx="auto" mt={20}>
        <Button onClick={openFishiErgebnisseMdal} mx="auto">
          Fischikampf ergebnisse
        </Button>
        <Button onClick={openBulkAddDonationsModal} mx="auto">
          Bulk Spnden hinzufügen
        </Button>
      </SimpleGrid>
    </>
  );
}
