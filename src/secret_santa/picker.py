import random
from typing import Dict, Hashable, Set

from secret_santa.participant import Participant


def assign_pairs(input_: Set[Participant], seed: int) -> Dict[Participant, Participant]:
    if len(input_) == 1:
        raise ValueError("Input should not be of length 1.")

    input_list = list(input_)
    input_list.sort(key= lambda i: i.name)
    print(input_list)

    random.seed(seed)

    open_set = list(input_list)
    result = {}

    for item in input_list:
        choices = list(open_set)

        if item in choices:
            choices.remove(item)

        choice = random.choice(tuple(choices))
        open_set.remove(choice)

        result[item] = choice
    print(input_)
    return result
