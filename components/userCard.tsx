import { Container, Collapse, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function UserCard(data: any) {
    const [opened, { toggle: toggle }] = useDisclosure(false);
    const [nameHistoryopened, { toggle: toggleNameHistory }] = useDisclosure(false);


    const date1: any = new Date(data.data.joinedAt);
    const date2: any = new Date();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <>
            <Container>
                <Text size="xl" fw="800" onClick={toggle} style={{ cursor: "pointer" }}>
                    {data.data.name}
                </Text>
                <Collapse in={opened}>
                    <Text>
                        Id: {data.data.id}
                    </Text>
                    <Text>
                        Name: {data.data.name}
                    </Text>
                    <Text>
                        Spenden: {data.data.donations}
                    </Text>
                    <Text>
                        Male bei Fisch gefehlt: {(diffDays * 2) - data.data.fish} ({Math.round((((diffDays * 2) - data.data.fish) / (diffDays * 2)) * 100)}% gefehlt)
                    </Text>
                    {/* <Text>
                        Beigetreten am: {data.joinedAt}
                    </Text> */}
                    {
                        data.data.nameHistory ?
                            <>
                                <Text>
                                    Name History
                                </Text>
                                <Collapse in={nameHistoryopened}>
                                    {
                                        data.data.nameHistory.map((name: any) => {
                                            return <Text>{name}</Text>
                                        })
                                    }
                                </Collapse>
                            </>
                            : <></>
                    }
                </Collapse>
            </Container>
        </>
    )
}