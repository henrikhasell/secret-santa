from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Participant:
    name: str

    def __repr__(self):
        return f"<Participant: {self.name}>"

    def serialize(self):
        return asdict(self)

    @staticmethod
    def deserialize(input_: dict):
        return Participant(**input_)

