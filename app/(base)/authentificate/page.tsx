"use client"

import { CloseButton, Container, Input, Paper, Text, Button } from "@mantine/core";
import { useState } from "react";
import { setCookie } from 'cookies-next';
import { notifications } from '@mantine/notifications';

export default function HomePage() {
  const [value, setValue] = useState('');



  const handleVerify = () => {
    console.log(value)
    if (value == "EichelStinktNachKäse🤢") {
      console.log("verified")
      setCookie("verified", "Ja, der typ ist Verifiziert 🍄", {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
      window.location.href = ""
    } else {
      console.log("not verified")
      notifications.show({
        color: 'red',
        title: 'Falscher Code',
        message: 'Der Code den du eingegeben hast ist leider Falsch :c',
      })
    }
  }

  return (
    <>
      <Container mt="150">
        <Paper mx="auto">
          <Container mx="auto" ml={0}>
            <Text size="xl" fw="800">
              Pilzkrieger!! 🍄
            </Text>
          </Container>
          <Container ml={0}>
            Bitte verifiziere dich mit deinem Code den du bekommen hast
          </Container>
          <Input
            placeholder="Code"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            mt="md"
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => setValue('')}
                style={{ display: value ? undefined : 'none' }}
              />
            }
          />
          <Button mt={"xl"} mx="auto" onClick={() => {handleVerify()}}>
            Verifizieren
          </Button>
        </Paper>
      </Container>
    </>
  );
}
