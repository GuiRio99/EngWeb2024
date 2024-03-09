import json

def new_json(file):
    
    with open(file, 'r') as f:
        data = json.load(f)
    
   
    compositores = data['compositores']
    periodosD = {}
    
    for c in compositores:
        if c['periodo'] not in periodosD:
            periodosD[c['periodo']] = {'id': len(periodosD)+1, 'name': c['periodo']}
    
    data['periodos'] = list(periodosD.values())

    for cmp in compositores:
        cmp['periodo'] = periodosD[cmp['periodo']]

    return data


if __name__ == "__main__":   
    nj = new_json("compositores.json")
    with open("compositores.json", 'w') as f:
        json.dump(nj, f, indent=2)