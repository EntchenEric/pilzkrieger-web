import { Container, Collapse, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";

export function UserCard(data: any) {
  const [opened, { toggle: toggle }] = useDisclosure(false);
  const [nameHistoryopened, { toggle: toggleNameHistory }] =
    useDisclosure(false);

  const date1: any = new Date(data.data.joinedAt);
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


  const maxPossibleFish = (diffDays * 2) - getTimeStatus(date1);

  return (
    <>
      <Container>
        <Text size="xl" fw="800" onClick={toggle} style={{cursor: "pointer",  userSelect: "none"}}>
          {data.data.name}
        </Text>
        <Collapse in={opened}>
          <Text>Id: {data.data.id}</Text>
          <Text>Name: {data.data.name}</Text>
          <Text>Spenden: {data.data.donations}</Text>
          <Text>
            Fisch teilnahmen: {data.data.fish}/{maxPossibleFish}
          </Text>
          <Text>
            Beigetreten am: {moment(data.data.joinedAt).format("Do MMM YYYY")}
          </Text>
          {data.data.nameHistories ? (
            <>
              <Text style={{cursor: "pointer",  userSelect: "none"}} onClick={toggleNameHistory}>Vergangene Namen</Text>
              <Collapse in={nameHistoryopened}>
                {data.data.nameHistories.map((name: any, index: number) => {
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
