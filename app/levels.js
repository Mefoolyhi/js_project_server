const Levels = [
    {
        name: 'FirstTry',
        description: 'Простой уровень с флагами',
        stars: '*',
        width: 4,
        height: 4,
        sets: [
            'flags'
        ]
    },
    {
        name: 'Second',
        description: 'Простой уровень с рандомными иконками',
        stars: '*',
        width: 4,
        height: 4,
        sets: [
            'random'
        ]
    },
    {
        name: 'Third',
        description: 'Сложный уровень с флагами, рандомом и животными',
        stars: '***',
        width: 10,
        height: 4,
        sets: [
            'random', 'flags', 'animals'
        ]
    }
]

module.exports = Levels;