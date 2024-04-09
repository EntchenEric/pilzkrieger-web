import { Container, Collapse, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import { useEffect, useState } from "react";

export function UserCard({ data, minFishPercente, minDonationPercente}: {data: any, minFishPercente: number, minDonationPercente: number}) {
  const [opened, { toggle: toggle }] = useDisclosure(false);
  const [nameHistoryopened, { toggle: toggleNameHistory }] = useDisclosure(false);

  const [nameColor, setNameColor] = useState("")

  const date1: any = new Date(data.joinedAt);
  const date2: any = new Date();
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  function getTimeStatus(currentDate: any) {
    // Extract hours and minutes from the current date
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    // Define the cutoff times
    const past1915 = 19 * 60 + 15; // 19:15 in minutes
    const past1215 = 12 * 60 + 15; // 12:15 in minutes

    // Convert current time to minutes
    const currentTimeInMinutes = hours * 60 + minutes;

    // Check the conditions and return the corresponding value
    if (currentTimeInMinutes >= past1915) {
      return 0;
    } else if (currentTimeInMinutes >= past1215) {
      return 1;
    } else {
      return 2;
    }
  }

  function isWithinRange(num1: number, num2: number, range: number) {
    return Math.abs(num1 - num2) <= range;
  }

  const maxPossibleFish = (diffDays * 2) - getTimeStatus(date1);

  const maxPossibleDonatons = diffDays * 500;

  useEffect(() => {
    let normalColor = false
    if(data.name === "Eichel"){
      console.log((data.donations / maxPossibleDonatons) * 100 < minDonationPercente)
      console.log((data.fish / maxPossibleFish) * 100 < minFishPercente)
    }
    if ((data.donations / maxPossibleDonatons) * 100 < minDonationPercente) {
      setNameColor("darkred")
    }
    else if (isWithinRange((data.donations / maxPossibleDonatons) * 100, minDonationPercente, 2)) {
      setNameColor("red")
    }
    else if (isWithinRange((data.donations / maxPossibleDonatons) * 100, minDonationPercente, 5)) {
      setNameColor("orange")
    }  
    else {
      normalColor = true
    }
    
    if((data.fish / maxPossibleFish) * 100 < minFishPercente) {
      setNameColor("darkred")
    }
    else if (isWithinRange((data.fish / maxPossibleFish) * 100, minFishPercente, 2)) {
      setNameColor("red")
    }
    else if (isWithinRange((data.fish / maxPossibleFish) * 100, minFishPercente, 5)) {
      setNameColor("orange")
    }
    else if (normalColor){
      setNameColor("")
    }
  }, [minDonationPercente, minFishPercente])

  

  return (
    <>
      <Container>
        <Text size="xl" fw="800" onClick={toggle} style={{ cursor: "pointer", userSelect: "none" }} c={nameColor}>
          {data.name}
        </Text>
        <Collapse in={opened}>
          <Text>Id: {data.id}</Text>
          <Text>Name: {data.name}</Text>
          <Text>Spenden: {data.donations}/{maxPossibleDonatons} ({Math.round((data.donations / maxPossibleDonatons) * 100)}%)</Text>
          <Text>
            Fisch teilnahmen: {data.fish}/{maxPossibleFish} ({Math.round((data.fish / maxPossibleFish) * 100)}%)
          </Text>
          <Text>
            Beigetreten am: {moment(data.joinedAt).format("Do MMM YYYY")}
          </Text>
          {data.nameHistories.length != 0 ? (
            <>
              <Text style={{ cursor: "pointer", userSelect: "none" }} onClick={toggleNameHistory}>Vergangene Namen</Text>
              <Collapse in={nameHistoryopened}>
                {data.nameHistories.map((name: any, index: number) => {
                  console.log(name)
                  return <Text key={index}>{name.name}</Text>;
                })}
              </Collapse>
            </>
          ) : (
            <></>
          )}
        </Collapse>
      </Container>
    </>
  );
}
