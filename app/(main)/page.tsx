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
  Slider,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect, use } from "react";
import { UserCard } from "@/components/userCard";
import { useForm } from "@mantine/form";
import { DatePickerInput } from '@mantine/dates';

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
      fishParticipations: 0,
      donations: 0,
      joinedAt: new Date(),
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

  const [memberColumns, setMemberColumns] = useState(5);
  const [minDonationPercente, setMinDonationPercente] = useState(80);
  const [minFishPercente, setminFishPercente] = useState(80);


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
    <Container px={150} size={"100%"}>
      <Modal
        opened={addMemberModalOpened}
        onClose={closeAddMemberModal}
        title="Mitglied hinzufügen"
      >
        <Container mb={"lg"}>
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
            const respoData = await respo.json();
            //reload window
            window.location.reload()
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
          mb={"lg"}
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
          onChange={(value: any) => {
            const member: any = users.find((user: any) => user.id === value.split("(")[1].split(")")[0])
            editMemberForm.setValues({
              nameChange: member.name,
              donations: member.donations,
              fishParticipations: member.fish,
              joinedAt: new Date(member.joinedAt)
            })
            seteditMemberValue(value)
          }}
        />

        <Container mb={"lg"}>
          <TextInput
            disabled={editMemberValue === null || editMemberValue === ""}
            {...editMemberForm.getInputProps("nameChange")}
            label="Name"
            placeholder="Name"
          />
          <NumberInput
            disabled={editMemberValue === null || editMemberValue === ""}
            {...editMemberForm.getInputProps("donations")}
            label="Spenden"
            placeholder="Spenden"
            min={0}
            step={100}
            thousandSeparator=" "
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 1.2, 25)}
          />
          <NumberInput
            disabled={editMemberValue === null || editMemberValue === ""}
            mt={"sm"}
            {...editMemberForm.getInputProps("fishParticipations")}
            label="Fischteilnahme"
            placeholder="Fischteilnahme"
          />
          <DatePickerInput
            disabled={editMemberValue === null || editMemberValue === ""}
            valueFormat="DD.MM.YYYY"
            label="Beitrittsdatum"
            placeholder="Beitrittsdatum"
            {...editMemberForm.getInputProps("joinedAt")}
          />

        </Container>

        <Button
          onClick={() => {
            fetch("/api/editUser", {
              method: "POST",
              body: JSON.stringify({
                id: editMemberValue?.split("(")[1].split(")")[0],
                ...editMemberForm.values,
                setDonations: true,
                setFishParticipations: true
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
        title="Fischikampf Teilnahmen"
      >
        <MultiSelect
          data={users.map((user: any) => {
            return user.name + " (" + user.id + ")";
          })}
          value={fishiTeilnehmer}
          onChange={setFishiTelnehmer}
          searchable
        />
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
                  donations: bulkDonationValue,
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
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        Farbschema ändern
      </Text>
      <Collapse in={colorSchemeOpened}>
        <ColorSchemeToggle />
      </Collapse>

      <SimpleGrid cols={{ base: 1, lg: 3 }} max-w={"750"} mx="auto" mt={20}>
        <Button p={0} onClick={openAddMemberModal}>
          Mitglied hinzufügen
        </Button>
        <Button p={0} onClick={openRemoveMemberModal}>
          Mitglied entefernen
        </Button>
        <Button p={0} onClick={() => {
          openEditMemberModal()
        }}>
          Mitgliederdaten bearbeiten
        </Button>
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, lg: 2 }} max-w={"750"} mx="auto" mt={20}>
        <Button onClick={openFishiErgebnisseMdal} mx="auto">
          Fischikampf Teilnahmen
        </Button>
        <Button onClick={openBulkAddDonationsModal} mx="auto">
          Bulk Spenden hinzufügen
        </Button>
      </SimpleGrid>
      <Text
        c="dimmed"
        ta="center"
        size="lg"
        maw={580}
        mx="auto"
        mt="xl"
        onClick={toggleEditUsers}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        Clanmitglieder einsehen ({users.length})
      </Text>
      <Collapse in={editUsersOpened} mb={150}>
        <Slider
          value={memberColumns}
          onChange={setMemberColumns}
          min={1}
          max={10}
          marks={[
            { value: 2, label: '2' },
            { value: 5, label: '5' },
            { value: 8, label: '8' },]}
          mb={25} />
        <SimpleGrid cols={2} w={"100%"} mb={25}>
          <Container size={"100%"}>
            <Text>
              Mindest Fischteilnahmen Prozent
            </Text>
            <Slider
              value={minFishPercente}
              onChange={setminFishPercente}
              min={0}
              max={100}
              marks={[
                { value: 20, label: '20%' },
                { value: 50, label: '50%' },
                { value: 80, label: '80%' },]}
              mb={10} />
          </Container>
          <Container size={"100%"}> 
            <Text>
              Mindest Spenden Prozent
            </Text>
            <Slider
              value={minDonationPercente}
              onChange={setMinDonationPercente}
              min={0}
              max={100}
              marks={[
                { value: 20, label: '20%' },
                { value: 50, label: '50%' },
                { value: 80, label: '80%' },]}
              mb={10} />
          </Container>
        </SimpleGrid>
        <SimpleGrid cols={memberColumns} px={69} mx={"auto"}>
          {users.map((user, index) => {
            return <UserCard key={index} data={user} minFishPercente={minFishPercente} minDonationPercente={minDonationPercente} />;
          })}
        </SimpleGrid>
      </Collapse>
    </Container>
  );
}
