var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {
    "next": null,
    "previous": null,
    "results": [
        {
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Gabrielle Nankindu",
            "language": "eng",
            "urns": [
                "tel:+256731163521"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "55",
                "lastedu": null,
                "sex": "F"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Laura Mbabazi",
            "language": "gan",
            "urns": [
                "tel:+256786471175"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "34",
                "lastedu": null,
                "sex": "F"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Teresa Nakasinde",
            "language": "eng",
            "urns": [
                "tel:+256762020595"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "61",
                "lastedu": null,
                "sex": "F"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Johnathan Ssebugulu",
            "language": "eng",
            "urns": [
                "tel:+256796155213"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "65",
                "lastedu": null,
                "sex": "M"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Sean Ouma",
            "language": "eng",
            "urns": [
                "tel:+256786307778"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "44",
                "lastedu": null,
                "sex": "M"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Francis Byaruhanga",
            "language": "eng",
            "urns": [
                "tel:+256410052135"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "39",
                "lastedu": null,
                "sex": "F"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Owen Tumewsigye",
            "language": "eng",
            "urns": [
                "tel:+256751491858"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "29",
                "lastedu": null,
                "sex": "M"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Sarah Kirabo",
            "language": "eng",
            "urns": [
                "tel:+256760995428"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "39",
                "lastedu": null,
                "sex": "F"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Blanche Nanyanzi",
            "language": "eng",
            "urns": [
                "tel:+256782163071"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "44",
                "lastedu": null,
                "sex": "F"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        },{
            "uuid": "6c45471e-829d-4f8a-b948-78f7d988ebfc",
            "name": "Jason Bakabulindi",
            "language": "eng",
            "urns": [
                "tel:+256751491858"
            ],
            "groups": [
                {
                    "uuid": "da98a4fa-9817-4d24-9a8c-4313a70374db",
                    "name": "Clinician 1"
                }
            ],
            "fields": {
                "status": null,
                "age": "48",
                "lastedu": null,
                "sex": "M"
            },
            "blocked": false,
            "stopped": false,
            "created_on": "2018-01-23T15:28:45.510555Z",
            "modified_on": "2018-02-20T16:55:23.981121Z"
        }
    ]
}])
});

module.exports = router;