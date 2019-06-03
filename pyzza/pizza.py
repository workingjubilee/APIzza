from pizzapi import *
from flask import Flask, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/order', methods=['POST'])
def pyzza_order():
    post = flask.request.get_json(force=True)
    try:
        customer = Customer(post.first_name, post.last_name,
                            post.email, post.phone)
        address = Address(post.street, post.city, post.region, post.zip)
        store = address.closest_store()
        order = Order(store, customer, address)
        for pizza in post.pizzas:
            order.add_item(pizza)
        card = PaymentObject(
            post.cc_number, post.cc_expiration, post.cc_vv, post.cc_zip)
        dominos = order.place(card)
        return Response(dominos, mimetype="text/html")
    except:


@app.route('/', methods=['POST'])
def pyzza_menu():
    try:
        post = flask.request.get_json(force=True)
    except:
        return Response("Insufficient JSON.", mimetype="text/plain")
    try:
        address = address = Address(
            post.street, post.city, post.region, post.zip)
        store = address.closest_store()
        menu = store.get_menu()
        pizzas = menu.search(Name="izza")
        return Response(f'{menu}')
    except:
        return Response("No stores open and nearby.", mimetype="text/plain")
